// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as datetimeConstants from "@std/datetime/constants";
import * as httpCookie from "@std/http/cookie";
import * as httpStatus from "@std/http/status";
import * as ulid from "@std/ulid";
import {
  OAuth2Client,
  type OAuth2ClientConfig,
  type Tokens,
} from "oauth2-client";
import { isHttps } from "@/pkg/main/library/http/is-http.ts";
import { redirect } from "@/pkg/main/library/http/redirect.ts";
import {
  deleteSiteSession,
  getAndDeleteOAuthSession,
  isSiteSession,
  setOAuthSession,
  setSiteSession,
} from "./_kv.ts";

export const OAUTH_COOKIE_NAME = "oauth-session";
export const SITE_COOKIE_NAME = "site-session";

/**
 * Dynamically prefixes the cookie name, depending on whether it's for a secure
 * origin (HTTPS).
 */
export function getCookieName(name: string, isHttps: boolean): string {
  return isHttps ? "__Host-" + name : name;
}

/**
 * @see {@link https://web.dev/first-party-cookie-recipes/#the-good-first-party-cookie-recipe}
 */
export const COOKIE_BASE = {
  secure: true,
  path: "/",
  httpOnly: true,
  // 90 days
  maxAge: 7776000,
  sameSite: "Lax",
} as Required<
  Pick<httpCookie.Cookie, "path" | "httpOnly" | "maxAge" | "sameSite">
>;

/**
 * @see {@link https://deno.land/x/deno_kv_oauth@v0.9.0#redirects-after-sign-in-and-sign-out}
 */
export function getSuccessUrl(request: Request): string {
  const url = new URL(request.url);

  const successUrl = url.searchParams.get("success_url");
  if (successUrl !== null) {
    return successUrl;
  }

  const referrer = request.headers.get("referer");
  if (referrer !== null && (new URL(referrer).origin === url.origin)) {
    return referrer;
  }

  return "/";
}

export function getSessionIdCookie(
  request: Request,
  cookieName = getCookieName(SITE_COOKIE_NAME, isHttps(request.url)),
): string | undefined {
  return httpCookie.getCookies(request.headers)[cookieName];
}

// client

export type ClientOptions = {
  oauth: OAuth2ClientConfig;
  cookie?: Partial<httpCookie.Cookie>;
};

export type ClientState = {
  options: ClientOptions;
};

export const createClientState = (options: ClientOptions): ClientState => {
  return {
    options,
  };
};

/**
 * Creates the full set of helpers with the given OAuth configuration and
 * options.
 *
 * @example
 * ```ts
 * // server.ts
 * import { createClient } from "./oauth/mod.ts";
 *
 * const client = createClient({
 *   oauth: {
 *     clientId: Deno.env.get("GITHUB_CLIENT_ID") ?? "",
 *     clientSecret: Deno.env.get("GITHUB_CLIENT_SECRET"),
 *     authorizationEndpointUri: "https://github.com/login/oauth/authorize",
 *     tokenUri: "https://github.com/login/oauth/access_token",
 *     // redirectUri: config?.redirectUri,
 *     // defaults: { scope: config?.scope },
 *   },
 *   cookie: {
 *     name: "__Secure-triple-choc",
 *     domain: "news.site",
 *   },
 * });
 *
 * async function handler(request: Request) {
 *   const { pathname } = new URL(request.url);
 *   switch (pathname) {
 *     case "/oauth/signin":
 *       return await client.signIn(request);
 *     case "/oauth/callback":
 *       const { response } = await client.handleCallback(request);
 *       return response;
 *     case "/oauth/signout":
 *       return await client.signOut(request);
 *     case "/protected-route":
 *       return await client.getSessionId(request) === undefined
 *         ? new Response("Unauthorized", { status: 401 })
 *         : new Response("You are allowed");
 *     default:
 *       return new Response(null, { status: 404 });
 *   }
 * }
 *
 * Deno.serve(handler);
 * ```
 */
export const Client = class {
  readonly state: ClientState;

  constructor(state: ClientState) {
    this.state = state;
  }

  async signIn(
    request: Request,
    urlParams?: Record<string, string>,
  ): Promise<Response> {
    const state = ulid.ulid();
    const { uri, codeVerifier } = await new OAuth2Client(
      this.state.options.oauth,
    )
      .code.getAuthorizationUri({ state });

    if (urlParams !== undefined) {
      for (const [key, value] of Object.entries(urlParams)) {
        uri.searchParams.append(key, value);
      }
    }

    const oauthSessionId = ulid.ulid();
    const oauthCookie: httpCookie.Cookie = {
      ...COOKIE_BASE,
      name: getCookieName(OAUTH_COOKIE_NAME, isHttps(request.url)),
      value: oauthSessionId,
      secure: isHttps(request.url),
      /**
       * A maximum authorization code lifetime of 10 minutes is recommended.
       * This cookie lifetime matches that value.
       *
       * @see {@link https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2}
       */
      maxAge: 10 * 60,
    };
    const successUrl = getSuccessUrl(request);

    await setOAuthSession(oauthSessionId, { state, codeVerifier, successUrl }, {
      expireIn: oauthCookie.maxAge! * datetimeConstants.SECOND,
    });

    const response = redirect(uri.toString(), httpStatus.STATUS_CODE.Found);
    httpCookie.setCookie(response.headers, oauthCookie);

    return response;
  }

  async handleCallback(request: Request): Promise<{
    response: Response;
    sessionId: string;
    tokens: Tokens;
  }> {
    const oauthCookieName = getCookieName(
      OAUTH_COOKIE_NAME,
      isHttps(request.url),
    );
    const oauthSessionId =
      httpCookie.getCookies(request.headers)[oauthCookieName];
    if (oauthSessionId === undefined) {
      throw new Error("OAuth cookie not found");
    }
    const oauthSession = await getAndDeleteOAuthSession(oauthSessionId);

    const tokens = await new OAuth2Client(this.state.options.oauth)
      .code.getToken(request.url, oauthSession);

    const sessionId = ulid.ulid();
    const response = redirect(
      oauthSession.successUrl,
      httpStatus.STATUS_CODE.Found,
    );
    const siteCookie: httpCookie.Cookie = {
      ...COOKIE_BASE,
      name: getCookieName(SITE_COOKIE_NAME, isHttps(request.url)),
      value: sessionId,
      secure: isHttps(request.url),
      ...this.state.options.cookie,
    };
    httpCookie.setCookie(response.headers, siteCookie);
    await setSiteSession(
      sessionId,
      siteCookie.maxAge
        ? siteCookie.maxAge * datetimeConstants.SECOND
        : undefined,
    );

    return {
      response,
      sessionId,
      tokens,
    };
  }

  async signOut(request: Request): Promise<Response> {
    const successUrl = getSuccessUrl(request);
    const response = redirect(successUrl, httpStatus.STATUS_CODE.Found);

    const sessionId = getSessionIdCookie(
      request,
      this.state.options.cookie?.name,
    );
    if (sessionId === undefined) {
      return response;
    }

    await deleteSiteSession(sessionId);

    const cookieName = this.state.options.cookie?.name ??
      getCookieName(SITE_COOKIE_NAME, isHttps(request.url));

    httpCookie.deleteCookie(response.headers, cookieName, {
      path: COOKIE_BASE.path,
      ...this.state.options?.cookie,
    });

    return response;
  }

  async getSessionId(request: Request): Promise<string | undefined> {
    const sessionId = getSessionIdCookie(
      request,
      this.state.options.cookie?.name,
    );
    return (sessionId !== undefined && await isSiteSession(sessionId))
      ? sessionId
      : undefined;
  }
};

export const createClient = (options: ClientOptions) => {
  return new Client(createClientState(options));
};

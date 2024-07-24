// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
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

export { type Tokens } from "oauth2-client";
export const SITE_COOKIE_NAME = "site-session";

export interface Session {
  id: string;
  status: "active" | "logged_out" | "expired" | "revoked" | "login_requested";

  state: string;
  codeVerifier: string;
  redirectUri?: string;

  loggedInUserId?: string;
  loggedInAt?: Date;
  expiresAt?: Date;
}

/**
 * Dynamically prefixes the cookie name, depending on whether it's for a secure
 * origin (HTTPS).
 */
export const getCookieName = (name: string, isHttps: boolean): string => {
  return isHttps ? `__Host-${name}` : name;
};

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

export const getSuccessUri = (request: Request): string => {
  const url = new URL(request.url);

  const successUri = url.searchParams.get("successUri");
  if (successUri !== null) {
    return successUri;
  }

  const referrer = request.headers.get("referer");
  if (referrer !== null && (new URL(referrer).origin === url.origin)) {
    return referrer;
  }

  return "/";
};

// client

export type ClientOptions = {
  oauth: OAuth2ClientConfig;
  cookie?: Partial<httpCookie.Cookie>;
  hooks: {
    getSession: (id: string) => Promise<Session | undefined>;
    onLoginRequested: (session: Session) => Promise<void>;
    onLoginCallback: (
      id: string,
      expiresAt: Date,
      tokens: Tokens,
    ) => Promise<void>;
    onLogout: (id: string) => Promise<void>;
  };
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

  getSessionCookie(
    request: Request,
    defaultCookieName?: string,
  ): { cookieName: string; sessionId: string | undefined } {
    const cookies = httpCookie.getCookies(request.headers);
    const cookieName = defaultCookieName ?? this.state.options.cookie?.name ??
      getCookieName(SITE_COOKIE_NAME, isHttps(request.url));

    const sessionId = cookies[cookieName];

    return {
      cookieName,
      sessionId,
    };
  }

  async signIn(
    request: Request,
    urlParams?: Record<string, string>,
  ): Promise<Response> {
    const sessionId = ulid.ulid();
    const state = ulid.ulid();

    const oauthClient = new OAuth2Client(this.state.options.oauth);
    const { uri, codeVerifier } = await oauthClient.code.getAuthorizationUri({
      state,
    });

    if (urlParams !== undefined) {
      for (const [key, value] of Object.entries(urlParams)) {
        uri.searchParams.append(key, value);
      }
    }

    const siteCookie: httpCookie.Cookie = {
      ...COOKIE_BASE,
      name: getCookieName(SITE_COOKIE_NAME, isHttps(request.url)),
      value: sessionId,
      secure: isHttps(request.url),
      ...this.state.options.cookie,
      /**
       * A maximum authorization code lifetime of 10 minutes is recommended.
       * This cookie lifetime matches that value.
       *
       * @see {@link https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2}
       */
      maxAge: 10 * 60,
    };

    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + (siteCookie.maxAge! * datetimeConstants.SECOND),
    );

    const session: Session = {
      id: sessionId,
      status: "login_requested",

      state: state,
      codeVerifier: codeVerifier,
      redirectUri: getSuccessUri(request),

      expiresAt: expiresAt,
    };

    await this.state.options.hooks.onLoginRequested(session);

    const response = redirect(uri.toString(), httpStatus.STATUS_CODE.Found);
    httpCookie.setCookie(response.headers, siteCookie);

    return response;
  }

  async handleCallback(request: Request): Promise<Response> {
    const { cookieName, sessionId } = this.getSessionCookie(request);

    if (sessionId === undefined) {
      throw new Error("OAuth cookie not found");
    }

    const session = await this.state.options.hooks
      .getSession(sessionId);

    if (session === undefined) {
      throw new Deno.errors.NotFound("OAuth session not found");
    }

    const oauthClient = new OAuth2Client(this.state.options.oauth);
    const tokens = await oauthClient.code.getToken(request.url, session);

    const siteCookie: httpCookie.Cookie = {
      ...COOKIE_BASE,
      name: cookieName,
      value: sessionId,
      secure: isHttps(request.url),
      ...this.state.options.cookie,
    };

    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + (siteCookie.maxAge! * datetimeConstants.SECOND),
    );

    await this.state.options.hooks.onLoginCallback(
      sessionId,
      expiresAt,
      tokens,
    );

    const response = redirect(
      session.redirectUri ?? "/",
      httpStatus.STATUS_CODE.Found,
    );
    httpCookie.setCookie(response.headers, siteCookie);

    return response;
  }

  async signOut(request: Request): Promise<Response> {
    const successUri = getSuccessUri(request);
    const response = redirect(successUri, httpStatus.STATUS_CODE.Found);

    const { cookieName, sessionId } = this.getSessionCookie(request);

    if (sessionId === undefined) {
      return response;
    }

    await this.state.options.hooks.onLogout(sessionId);

    httpCookie.deleteCookie(response.headers, cookieName, {
      path: COOKIE_BASE.path,
      ...this.state.options?.cookie,
    });

    return response;
  }

  getSessionId(request: Request): string | undefined {
    const { sessionId } = this.getSessionCookie(request);

    if (sessionId === undefined) {
      return undefined;
    }

    return sessionId;
  }
};

export const createClient = (options: ClientOptions) => {
  return new Client(createClientState(options));
};

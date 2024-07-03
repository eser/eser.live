// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as ulid from "@std/ulid";
import { type Plugin } from "$fresh/server.ts";
import * as oauth from "@/pkg/main/library/oauth/mod.ts";
import * as users from "@/pkg/main/data/repositories/users.ts";
import * as sessions from "@/pkg/main/data/repositories/sessions.ts";
import * as github from "@/pkg/main/services/github.ts";

export async function getSession(
  id: string,
): Promise<oauth.Session | undefined> {
  const session = await sessions.sessionRepository.findById(id);

  if (session === undefined) {
    return undefined;
  }

  return {
    id: session.id,
    status: session.status,

    state: session.oauthRequestState,
    codeVerifier: session.oauthRequestCodeVerifier,
    redirectUri: session.oauthRedirectUri ?? undefined,

    loggedInUserId: session.loggedInUserId ?? undefined,
    loggedInAt: session.loggedInAt ?? undefined,
    expiresAt: session.expiresAt ?? undefined,
  };
}

export const onLoginRequested = async (session: oauth.Session) => {
  const sessionEntity: sessions.SessionPartial = {
    id: session.id,
    status: session.status,

    oauthRequestState: session.state,
    oauthRequestCodeVerifier: session.codeVerifier,
    oauthRedirectUri: session.redirectUri ?? null,

    loggedInUserId: session.loggedInUserId ?? null,
    loggedInAt: session.loggedInAt ?? null,
    expiresAt: session.expiresAt ?? null,
  };

  await sessions.sessionRepository.create(sessionEntity);
};

export const onLoginCallback = async (
  id: string,
  expiresAt: Date,
  tokens: oauth.Tokens,
) => {
  const githubUser = await github.getGitHubUser(tokens.accessToken);
  let user = await users.userRepository.findByGitHubRemoteId(githubUser.id);

  if (user === undefined) {
    user = await users.userRepository.upsertByGithubRemoteId({
      id: ulid.ulid(),
      kind: "regular",

      name: githubUser.name,
      email: githubUser.email,
      phone: null,
      githubRemoteId: githubUser.id,
      githubHandle: githubUser.login,
      xHandle: githubUser.twitter_username,
    });
  }

  const sessionEntity: Partial<sessions.SessionPartial> = {
    status: "active",

    loggedInUserId: user.id,
    loggedInAt: new Date(),
    expiresAt: expiresAt,
  };

  await sessions.sessionRepository.update(id, sessionEntity);
};

export const onLogout = async (
  id: string,
) => {
  const sessionEntity: Partial<sessions.SessionPartial> = {
    status: "logged_out",
    expiresAt: null,
  };

  await sessions.sessionRepository.update(id, sessionEntity);
};

export const oauthClient = oauth.createClient({
  oauth: {
    clientId: Deno.env.get("GITHUB_CLIENT_ID") ?? "",
    clientSecret: Deno.env.get("GITHUB_CLIENT_SECRET"),
    authorizationEndpointUri: "https://github.com/login/oauth/authorize",
    tokenUri: "https://github.com/login/oauth/access_token",
    // redirectUri: config?.redirectUri,
    // defaults: { scope: config?.scope },
  },
  hooks: {
    getSession,
    onLoginRequested,
    onLoginCallback,
    onLogout,
  },
});

// Exported for mocking and spying in e2e tests
export const _internals = { oauthClient };

export const oAuthPlugin: Plugin = {
  name: "oauth",
  routes: [
    {
      path: "/auth/login",
      handler: (req) => _internals.oauthClient.signIn(req),
    },
    {
      path: "/auth/callback",
      handler: (req) => _internals.oauthClient.handleCallback(req),
    },
    {
      path: "/auth/logout",
      handler: (req) => _internals.oauthClient.signOut(req),
    },
  ],
};

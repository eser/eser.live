// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as ulid from "@std/ulid";
import { type Plugin } from "$fresh/server.ts";
import * as oauth from "@/pkg/main/library/oauth/mod.ts";
import { userRepository } from "@/pkg/main/data/user/repository.ts";
import { sessionRepository } from "@/pkg/main/data/session/repository.ts";
import { type SessionPartial } from "@/pkg/main/data/session/types.ts";
import * as github from "@/pkg/main/services/github.ts";

export const getSession = async (
  id: string,
): Promise<oauth.Session | null> => {
  const session = await sessionRepository.findById(id);

  if (session === null) {
    return null;
  }

  return {
    id: session.id,
    status: session.status,

    state: session.oauthRequestState,
    codeVerifier: session.oauthRequestCodeVerifier,
    redirectUri: session.oauthRedirectUri,

    loggedInUserId: session.loggedInUserId,
    loggedInAt: session.loggedInAt,
    expiresAt: session.expiresAt,
  };
};

export const onLoginRequested = async (session: oauth.Session) => {
  const sessionEntity: SessionPartial = {
    id: session.id,
    status: session.status,

    oauthRequestState: session.state,
    oauthRequestCodeVerifier: session.codeVerifier,
    oauthRedirectUri: session.redirectUri ?? null,

    loggedInUserId: session.loggedInUserId ?? null,
    loggedInAt: session.loggedInAt ?? null,
    expiresAt: session.expiresAt ?? null,
  };

  await sessionRepository.create(sessionEntity);
};

export const onLoginCallback = async (
  id: string,
  expiresAt: Date,
  tokens: oauth.Tokens,
) => {
  const githubUser = await github.getGitHubUser(tokens.accessToken);
  let user = await userRepository.findByGitHubRemoteId(githubUser.id);

  if (user === null) {
    user = await userRepository.upsertByGithubRemoteId({
      id: ulid.ulid(),
      kind: "regular",

      name: githubUser.name,
      email: githubUser.email,
      phone: null,
      githubRemoteId: githubUser.id,
      githubHandle: githubUser.login,
      xHandle: githubUser.twitter_username,
    });

    if (user === null) {
      // TODO(@eser): a custom error type would be nice here
      throw new Error("Failed to create user");
    }
  }

  const sessionEntity: Partial<SessionPartial> = {
    status: "active",

    loggedInUserId: user.id,
    loggedInAt: new Date(),
    expiresAt: expiresAt,
  };

  await sessionRepository.update(id, sessionEntity);
};

export const onLogout = async (
  id: string,
) => {
  const sessionEntity: Partial<SessionPartial> = {
    status: "logged_out",
    expiresAt: null,
  };

  await sessionRepository.update(id, sessionEntity);
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

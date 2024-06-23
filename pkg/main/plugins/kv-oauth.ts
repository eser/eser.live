// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { type Plugin } from "$fresh/server.ts";
import * as oauth from "@/pkg/main/library/oauth/mod.ts";
import {
  createUser,
  getUser,
  updateUserSession,
  type User,
} from "@/pkg/main/services/users.ts";
import { getGitHubUser } from "@/pkg/main/services/github.ts";
import {
  deleteSiteSession,
  getAndDeleteOAuthSession,
  isSiteSession,
  setOAuthSession,
  setSiteSession,
} from "@/pkg/main/library/oauth/_kv.ts";

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
    setOAuthSession: setOAuthSession,
    getAndDeleteOAuthSession: getAndDeleteOAuthSession,
    deleteSiteSession: deleteSiteSession,
    isSiteSession: isSiteSession,
    setSiteSession: setSiteSession,
  },
});

// Exported for mocking and spying in e2e tests
export const _internals = { oauthClient };

/**
 * This custom plugin centralizes all authentication logic using the
 * {@link https://deno.land/x/deno_kv_oauth|Deno KV OAuth} module.
 *
 * The implementation is based off Deno KV OAuth's own
 * {@link https://deno.land/x/deno_kv_oauth/src/fresh_plugin.ts?source|Fresh plugin}
 * implementation.
 */
export default {
  name: "kv-oauth",
  routes: [
    {
      path: "/auth/login",
      handler: async (req) => await _internals.oauthClient.signIn(req),
    },
    {
      path: "/auth/callback",
      handler: async (req) => {
        const { response, tokens, sessionId } = await _internals.oauthClient
          .handleCallback(
            req,
          );

        const githubUser = await getGitHubUser(tokens.accessToken);
        const user = await getUser(githubUser.login);

        if (user === null) {
          const user: User = {
            login: githubUser.login,
            sessionId,
          };
          await createUser(user);
        } else {
          await updateUserSession(user, sessionId);
        }

        return response;
      },
    },
    {
      path: "/auth/logout",
      handler: _internals.oauthClient.signOut,
    },
  ],
} as Plugin;

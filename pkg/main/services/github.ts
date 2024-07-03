// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { BadRequestError } from "@/pkg/main/library/http/bad-request-error.ts";

type GitHubUser = {
  login: string;
  id: string;
  avatar_url: string;
  name: string;
  email: string;
  twitter_username: string;
};

/**
 * Returns the GitHub profile information of the user with the given access
 * token.
 *
 * @see {@link https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user}
 *
 * @example
 * ```ts
 * import { getGitHubUser } from "@/pkg/main/services/github.ts";
 *
 * const user = await getGitHubUser("<access token>");
 * user.login; // Returns "octocat"
 * user.email; // Returns "octocat@github.com"
 * ```
 */
export const getGitHubUser = async (accessToken: string) => {
  const resp = await fetch("https://api.github.com/user", {
    headers: { authorization: `Bearer ${accessToken}` },
  });

  if (!resp.ok) {
    const { message } = await resp.json();

    throw new BadRequestError(message);
  }

  return await resp.json() as Promise<GitHubUser>;
};

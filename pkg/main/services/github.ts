// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
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
    headers: {
      authorization: `Bearer ${accessToken}`,
      accept: "application/vnd.github+json",
    },
  });

  if (!resp.ok) {
    const { message } = await resp.json();

    throw new BadRequestError(message);
  }

  return (await resp.json()) as Promise<GitHubUser>;
};

export const getGitHubUserByLogin = async (accessToken: string, login: string) => {
  const resp = await fetch(`https://api.github.com/users/${login}`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      accept: "application/vnd.github+json",
    },
  });

  if (!resp.ok) {
    const { message } = await resp.json();

    throw new BadRequestError(message);
  }

  return (await resp.json()) as Promise<GitHubUser>;
};

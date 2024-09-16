// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { Octokit } from "@octokit/core";
import type { Cursor, CursorResult } from "@/pkg/main/library/data/cursors.ts";
import { BadRequestError } from "@/pkg/main/library/http/bad-request-error.ts";

export type GitHubUser = {
  login: string;
  id: string;
  avatar_url: string;
  name: string;
  email: string;
  twitter_username: string;
};

export type GitHubProject = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  topics: string[];
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

export async function fetchProjects(query: string, cursor: Cursor): Promise<CursorResult<GitHubProject, string>> {
  const octokit = new Octokit({ auth: Deno.env.get("GITHUB_TOKEN") });

  const currentPage = cursor.offset ? parseInt(cursor.offset) : 1;

  const response = await octokit.request("GET /search/repositories", {
    q: query,
    sort: "stars",
    order: "desc",
    per_page: cursor.pageSize,
    page: currentPage,
  });

  const nextCursor = response.data.total_count > currentPage * cursor.pageSize ? (currentPage + 1).toString() : null;

  return {
    items: response.data.items,
    nextCursor: nextCursor,
  };
}

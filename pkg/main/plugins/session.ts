// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { type FreshContext, Plugin } from "$fresh/server.ts";
import { type User } from "@/pkg/main/data/models/user.ts";
import * as sessions from "@/pkg/main/data/repositories/sessions.ts";
import { UnauthorizedError } from "@/pkg/main/library/http/unauthorized-error.ts";
import { oauthClient } from "./oauth.ts";

export interface State {
  sessionUser?: User;
  isEditor?: boolean;
  lang?: string;
  [K: string]: unknown;
}

export type LoggedInState = Required<State>;

export const stateDefaults: State = {
  sessionUser: undefined,
  isEditor: false,
  theme: "default",
  lang: "tr",
};

export const getEnv = (key: string, defaultValue?: string): string => {
  const value = Deno.env.get(key);

  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`"${key}" environment variable must be set`);
    }

    return defaultValue;
  }

  return value;
};

export const assertLoggedIn: (
  ctx: { state: State },
) => asserts ctx is { state: LoggedInState } = (
  ctx: { state: State },
): asserts ctx is { state: LoggedInState } => {
  if (ctx.state.sessionUser === undefined) {
    throw new UnauthorizedError("User must be logged in");
  }
};

export const assertIsEditor: (
  ctx: { state: State },
) => asserts ctx is { state: LoggedInState } = (
  ctx: { state: State },
): asserts ctx is { state: LoggedInState } => {
  if (ctx.state.isEditor !== true) {
    throw new UnauthorizedError("User must be an editor");
  }
};

const setSessionState = async (
  req: Request,
  ctx: FreshContext<State>,
) => {
  if (ctx.destination !== "route") {
    return await ctx.next();
  }

  // Initial state
  for (const [key, value] of Object.entries(stateDefaults)) {
    ctx.state[key] = value;
  }

  const sessionId = oauthClient.getSessionId(req);
  if (sessionId === undefined) {
    return await ctx.next();
  }

  const session = await sessions.sessionRepository.findById(sessionId);
  if (session === null) {
    return await ctx.next();
  }

  ctx.state.sessionUser = session?.user ?? undefined;
  const kind = ctx.state.sessionUser?.kind ?? "none";

  if (["editor", "admin"].includes(kind)) {
    ctx.state.isEditor = true;
  }

  return await ctx.next();
};

const ensureLoggedIn = async (
  _req: Request,
  ctx: FreshContext<State>,
) => {
  assertLoggedIn(ctx);

  return await ctx.next();
};

const ensureIsEditor = async (
  _req: Request,
  ctx: FreshContext<State>,
) => {
  assertIsEditor(ctx);

  return await ctx.next();
};

/**
 * Adds middleware to the defined routes that ensures the client is logged-in
 * before proceeding. The {@linkcode ensureLoggedIn} middleware throws an error
 * equivalent to the
 * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401|HTTP 401 Unauthorized}
 * error if `ctx.state.sessionUser` is `undefined`.
 *
 * The thrown error is then handled by {@linkcode handleWebPageErrors}, or
 * {@linkcode handleRestApiErrors}, if the request is made to a REST API
 * endpoint.
 *
 * @see {@link https://fresh.deno.dev/docs/concepts/plugins|Plugins documentation}
 * for more information on Fresh's plugin functionality.
 */
export const sessionPlugin: Plugin<State> = {
  name: "session",
  middlewares: [
    {
      path: "/",
      middleware: { handler: setSessionState },
    },
    {
      path: "/dash",
      middleware: { handler: ensureLoggedIn },
    },
    {
      path: "/api/me",
      middleware: { handler: ensureLoggedIn },
    },
    {
      path: "/api/questions/vote",
      middleware: { handler: ensureLoggedIn },
    },
    {
      path: "/api/questions/hide",
      middleware: { handler: ensureIsEditor },
    },
  ],
};

// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { type FreshContext, Plugin } from "$fresh/server.ts";
import { getSessionId } from "kv_oauth/mod.ts";
import { getUserBySession, type User } from "@/pkg/main/services/db.ts";
import { UnauthorizedError } from "@/pkg/main/library/http/unauthorized-error.ts";

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

export function getEnv(key: string, defaultValue?: string): string {
  const value = Deno.env.get(key);

  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`"${key}" environment variable must be set`);
    }

    return defaultValue;
  }

  return value;
}

export function assertLoggedIn(
  ctx: { state: State },
): asserts ctx is { state: LoggedInState } {
  if (ctx.state.sessionUser === undefined) {
    throw new UnauthorizedError("User must be logged in");
  }
}

export function assertIsEditor(
  ctx: { state: State },
): asserts ctx is { state: LoggedInState } {
  if (ctx.state.isEditor !== true) {
    throw new UnauthorizedError("User must be an editor");
  }
}

async function setSessionState(
  req: Request,
  ctx: FreshContext<State>,
) {
  if (ctx.destination !== "route") {
    return await ctx.next();
  }

  // Initial state
  for (const [key, value] of Object.entries(stateDefaults)) {
    ctx.state[key] = value;
  }

  const sessionId = await getSessionId(req);
  if (sessionId === undefined) {
    return await ctx.next();
  }

  const user = await getUserBySession(sessionId);
  if (user === null) {
    return await ctx.next();
  }

  ctx.state.sessionUser = user;

  const editors = getEnv("EDITOR_LOGINS", "").split(",");
  if (editors.includes(user.login)) {
    ctx.state.isEditor = true;
  }

  return await ctx.next();
}

async function ensureLoggedIn(
  _req: Request,
  ctx: FreshContext<State>,
) {
  assertLoggedIn(ctx);

  return await ctx.next();
}

async function ensureIsEditor(
  _req: Request,
  ctx: FreshContext<State>,
) {
  assertIsEditor(ctx);

  return await ctx.next();
}

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
export default {
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
} as Plugin<State>;

// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { accepts } from "@std/http/negotiation";
import type { FreshContext, Plugin } from "$fresh/server.ts";
import { sessionRepository } from "@/pkg/main/data/session/repository.ts";
import type { User } from "@/pkg/main/data/user/types.ts";
import { InvalidContentTypeError } from "@/pkg/main/library/http/invalid-content-type.ts";
import { BadRequestError } from "@/pkg/main/library/http/bad-request-error.ts";
import { UnauthorizedError } from "@/pkg/main/library/http/unauthorized-error.ts";
import { oauthClient } from "./oauth.ts";

export type State = {
  sessionUser: User | null;
  isEditor: boolean;
  theme: string;
  lang: string;
};

export type LoggedInState = State & {
  sessionUser: User;
};

export const stateDefaults: State = {
  sessionUser: null,
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

export const assertLoggedIn: (ctx: { state: State }) => asserts ctx is {
  state: State & { sessionUser: User };
} = (ctx: { state: State }) => {
  if (ctx.state.sessionUser === null) {
    throw new UnauthorizedError("User must be logged in");
  }
};

export const assertIsEditor: (ctx: { state: State }) => asserts ctx is {
  state: State & { isEditor: true };
} = (ctx: { state: State }) => {
  if (ctx.state.isEditor !== true) {
    throw new UnauthorizedError("User must be an editor");
  }
};

export const ensureMediaTypes = (req: Request, acceptableMediaTypes: string[]) => {
  const mediaTypes = accepts(req);

  const result = mediaTypes.filter((mediaType) => acceptableMediaTypes.includes(mediaType));

  if (result.length === 0) {
    throw new InvalidContentTypeError(acceptableMediaTypes);
  }

  return result;
};

export const ensureParameterIsSpecified = (name: string, value: string | undefined) => {
  if (value === undefined || value === null) {
    throw new BadRequestError(`"${name}" parameter must be specified`);
  }

  return value;
};

const setSessionState = async (req: Request, ctx: FreshContext<State>) => {
  if (ctx.destination !== "route") {
    return await ctx.next();
  }

  // Initial state
  Object.assign(ctx.state, stateDefaults);

  const { sessionId } = oauthClient.getSession(req);
  if (sessionId === null) {
    return await ctx.next();
  }

  const session = await sessionRepository.findById(sessionId);
  if (session === null) {
    return await ctx.next();
  }

  ctx.state.sessionUser = session.user;
  const kind = ctx.state.sessionUser?.kind ?? "none";

  if (["editor", "admin"].includes(kind)) {
    ctx.state.isEditor = true;
  }

  return await ctx.next();
};

const ensureLoggedIn = async (_req: Request, ctx: FreshContext<State>) => {
  assertLoggedIn(ctx);

  return await ctx.next();
};

const ensureIsEditor = async (_req: Request, ctx: FreshContext<State>) => {
  assertIsEditor(ctx);

  return await ctx.next();
};

/**
 * Adds middleware to the defined routes that ensures the client is logged-in
 * before proceeding. The {@linkcode ensureLoggedIn} middleware throws an error
 * equivalent to the
 * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401|HTTP 401 Unauthorized}
 * error if `ctx.state.sessionUser` is `null`.
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
      path: "/api/me/question-votes",
      middleware: { handler: ensureLoggedIn },
    },
    {
      path: "/api/me/questions",
      middleware: { handler: ensureLoggedIn },
    },
    {
      path: "/qa/vote",
      middleware: { handler: ensureLoggedIn },
    },
    {
      path: "/qa/hide",
      middleware: { handler: ensureIsEditor },
    },
  ],
};

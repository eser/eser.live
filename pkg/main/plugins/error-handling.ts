// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { STATUS_CODE, STATUS_TEXT } from "std/http/status.ts";
import { type Plugin } from "$fresh/server.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import {
  BadRequestError,
  redirect,
  UnauthorizedError,
} from "@/pkg/main/utils/http.ts";

/**
 * Returns the HTTP status code corresponding to a given runtime error. By
 * default, a HTTP 500 status code is returned.
 *
 * @example
 * ```ts
 * import { toErrorStatus } from "@/pkg/main/plugins/error-handling.ts";
 *
 * toErrorStatus(new Deno.errors.NotFound) // Returns 404
 * ```
 */
export function toErrorStatus(error: Error) {
  if (error instanceof Deno.errors.NotFound) return STATUS_CODE.NotFound;
  if (error instanceof UnauthorizedError) return STATUS_CODE.Unauthorized;
  if (error instanceof BadRequestError) return STATUS_CODE.BadRequest;
  return STATUS_CODE.InternalServerError;
}

export default {
  name: "error-handling",
  middlewares: [
    {
      path: "/",
      middleware: {
        async handler(_req, ctx) {
          try {
            return await ctx.next();
          } catch (error) {
            if (error instanceof UnauthorizedError) {
              return redirect("/auth/login");
            }
            throw error;
          }
        },
      },
    },
    {
      path: "/api",
      middleware: {
        async handler(_req, ctx) {
          try {
            return await ctx.next();
          } catch (error) {
            const status = toErrorStatus(error);
            return new Response(error.message, {
              statusText: STATUS_TEXT[status],
              status,
            });
          }
        },
      },
    },
  ],
} as Plugin<State>;

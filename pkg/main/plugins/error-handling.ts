// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as httpStatus from "@std/http/status";
import { type Plugin } from "$fresh/server.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import { redirect } from "@/pkg/main/library/http/redirect.ts";
import { BadRequestError } from "@/pkg/main/library/http/bad-request-error.ts";
import {
  UnauthorizedError,
} from "@/pkg/main/library/http/unauthorized-error.ts";

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
export const toErrorStatus = (error: Error) => {
  if (error instanceof Deno.errors.NotFound) {
    return httpStatus.STATUS_CODE.NotFound;
  }

  if (error instanceof UnauthorizedError) {
    return httpStatus.STATUS_CODE.Unauthorized;
  }

  if (error instanceof BadRequestError) {
    return httpStatus.STATUS_CODE.BadRequest;
  }

  return httpStatus.STATUS_CODE.InternalServerError;
};

export const errorHandlingPlugin: Plugin<State> = {
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
              statusText: httpStatus.STATUS_TEXT[status],
              status,
            });
          }
        },
      },
    },
  ],
};

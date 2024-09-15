// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { Plugin } from "$fresh/server.ts";
import { HttpError } from "@/pkg/main/library/http/http-error.ts";
import { redirect } from "@/pkg/main/library/http/redirect.ts";
import { UnauthorizedError } from "@/pkg/main/library/http/unauthorized-error.ts";
import type { State } from "@/pkg/main/plugins/session.ts";
import * as httpNegotiation from "@std/http/negotiation";
import * as httpStatus from "@std/http/status";

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

  if (error instanceof HttpError) {
    return error.status;
  }

  return httpStatus.STATUS_CODE.InternalServerError;
};

const jsonResponse = (error: Error) => {
  const status = toErrorStatus(error);

  return Response.json(
    {
      error: error.message,
    },
    {
      statusText: httpStatus.STATUS_TEXT[status],
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    },
  );
};

const textResponse = (error: Error) => {
  const status = toErrorStatus(error);

  return new Response(error.message, {
    statusText: httpStatus.STATUS_TEXT[status],
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};

export const errorHandlingPlugin: Plugin<State> = {
  name: "error-handling",
  middlewares: [
    {
      path: "/",
      middleware: {
        async handler(req, ctx) {
          try {
            return await ctx.next();
          } catch (error) {
            if (error instanceof UnauthorizedError) {
              return redirect("/auth/login");
            }

            console.error(error);

            if (httpNegotiation.accepts(req).includes("application/json")) {
              return jsonResponse(error);
            }

            return textResponse(error);
          }
        },
      },
    },
  ],
};

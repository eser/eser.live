// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as httpStatus from "@std/http/status";

/**
 * Returns a response that redirects the client to the given location (URL).
 *
 * @param location A relative (to the request URL) or absolute URL.
 * @param status HTTP status
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location}
 *
 * @example
 * ```ts
 * import { redirect } from "@/pkg/main/library/http/redirect.ts";
 *
 * redirect("/new-page"); // Redirects client to `/new-page` with HTTP status 303
 * redirect("/new-page", 301); // Redirects client to `/new-page` with HTTP status 301
 * ```
 */
export const redirect = (
  location: string,
  status:
    | typeof httpStatus.STATUS_CODE.Found
    | typeof httpStatus.STATUS_CODE.Created
    | httpStatus.RedirectStatus = httpStatus.STATUS_CODE.SeeOther,
) => {
  return new Response(null, {
    headers: {
      location,
    },
    status,
  });
};

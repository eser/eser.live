// Copyright 2024-present the Deno authors. All rights reserved. MIT license.

/**
 * Returns the `cursor` URL parameter value of the given URL.
 *
 * @example
 * ```ts
 * import { getCursor } from "@/pkg/main/library/http/get-cursor.ts";
 *
 * getCursor(new URL("http://example.com?cursor=12345")); // Returns "12345"
 * getCursor(new URL("http://example.com")); // Returns ""
 * ```
 */
export const getCursor = (url: URL) => {
  return url.searchParams.get("cursor") ?? "";
};

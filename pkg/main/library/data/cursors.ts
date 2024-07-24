// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

export type Cursor = {
  offset: string;
  pageSize: number;
};

/**
 * Returns the `cursor` URL parameter value of the given URL object.
 *
 * @example
 * ```ts
 * import { getCursorFromUrl } from "@/pkg/main/library/data/cursors.ts";
 *
 * getCursorFromUrl(new URL("http://example.com?cursor=12345")); // Returns { offset: "12345" }
 * getCursorFromUrl(new URL("http://example.com")); // Returns { offset: "" }
 * ```
 */
export const getCursorFromUrl = (url: URL, defaultPageSize: number): Cursor => {
  const offset = url.searchParams.get("cursor") ?? "";

  return {
    offset,
    pageSize: defaultPageSize,
  };
};

/**
 * Returns the `cursor` URL parameter value of the given url string.
 *
 * @example
 * ```ts
 * import { getCursor } from "@/pkg/main/library/data/cursors.ts";
 *
 * getCursor("http://example.com?cursor=12345"); // Returns { offset: "12345" }
 * getCursor("http://example.com"); // Returns { offset: "" }
 * ```
 */
export const getCursor = (url: string, defaultPageSize: number): Cursor => {
  return getCursorFromUrl(new URL(url), defaultPageSize);
};

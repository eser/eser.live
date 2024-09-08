// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

export type Cursor = {
  offset: string;
  pageSize: number;
};

export type CursorResult<T1, T2> = {
  items: Array<T1>;
  nextCursor: T2 | null;
};

/*
  Returns the given items with the cursor.

  @example
  ```ts
  import { withCursor } from "@/pkg/main/library/data/cursors.ts";

  const items = [1, 2, 3, 4, 5];
  const cursor = items[items.length - 1];
  const result = withCursor(items, cursor);
  console.log(result); // { items: [1, 2, 3, 4, 5], cursor: 5 }
  ```
*/
export function withCursor<T1, T2>(
  items: Array<T1>,
  nextCursor: T2,
): CursorResult<T1, T2> {
  return {
    items,
    nextCursor,
  };
}

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
export const getCursorFromUrl = (
  url: URL,
  defaultPageSize: number,
): Cursor => {
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
export const getCursor = (
  url: string,
  defaultPageSize: number,
): Cursor => {
  return getCursorFromUrl(new URL(url), defaultPageSize);
};

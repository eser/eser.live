// Copyright 2024-present the Deno authors. All rights reserved. MIT license.

/**
 * Returns the values and cursor for the resource of a given endpoint. In the
 * backend, the request handler collects these values and cursor by iterating
 * through a {@linkcode Deno.KvListIterator}
 *
 * @example
 * ```ts
 * import { fetchValues } from "@/pkg/main/library/http/fetch-values.ts";
 * import { type Question } from "@/pkg/main/services/db.ts";
 *
 * const body = await fetchValues<Question>("https://hunt.deno.land/api/questions", "12345");
 * body.items[0].id; // Returns "13f34b7e-5563-4001-98ed-9ee04d7af717"
 * body.items[0].question; // Returns "What?"
 * body.cursor; // Returns "12346"
 * ```
 */
export async function fetchValues<T>(endpoint: string, cursor: string) {
  let url = endpoint;

  if (cursor !== "") {
    url += "?cursor=" + cursor;
  }

  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Request failed: GET ${url}`);
  }

  return resp.json() as Promise<{ items: T[]; cursor: string }>;
}

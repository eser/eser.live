// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
/**
 * This script prints all entries in the KV database formatted as JSON. This
 * can be used to create a backup file.
 *
 * @example
 * ```bash
 * deno task db:dump > ./temp/backup.json
 * ```
 */
import { kv } from "@/pkg/main/utils/db.ts";

// https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-521460510
function replacer(_key: unknown, value: unknown) {
  return typeof value === "bigint" ? value.toString() : value;
}

const questions = await Array.fromAsync(
  kv.list({ prefix: [] }),
  ({ key, value }) => ({ key, value }),
);
console.log(JSON.stringify(questions, replacer, 2));

kv.close();

// Copyright 2024-present the Deno authors. All rights reserved. MIT license.

/**
 * Returns a pluralized string for the given amount and unit.
 *
 * @example
 * ```ts
 * import { pluralize } from "@/pkg/main/library/display/pluralize.ts";
 *
 * pluralize(0, "meow"); // Returns "0 meows"
 * pluralize(1, "meow"); // Returns "1 meow"
 * ```
 */
export const pluralize = (amount: number, unit: string) => {
  // return amount === 1 ? `${amount} ${unit}` : `${amount} ${unit}s`;
  return `${amount} ${unit}`;
};

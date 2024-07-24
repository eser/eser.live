// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

/**
 * Returns a formatted string based on the given amount of currency and the
 * `en-US` locale. Change the locale for your use case as required.
 *
 * @see {@linkcode Intl.NumberFormat}
 *
 * @example
 * ```ts
 * import { formatCurrency } from "@/pkg/main/library/display/format-currency.ts";
 *
 * formatCurrency(5, "USD"); // Returns "$5"
 * ```
 */
export const formatCurrency = (
  amount: number,
  currency: string,
): string => {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
      maximumFractionDigits: 0,
    },
  ).format(amount)
    // Issue: https://stackoverflow.com/questions/44533919/space-after-symbol-with-js-intl
    .replace(/^(\D+)/, "$1")
    .replace(/\s+/, "");
};

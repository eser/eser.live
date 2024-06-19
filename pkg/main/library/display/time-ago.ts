// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { difference, type Unit } from "std/datetime/difference.ts";
import { pluralize } from "./pluralize.ts";

/**
 * Returns how long ago a given date is from now.
 *
 * @example
 * ```ts
 * import { timeAgo } from "@/pkg/main/library/display/time-ago.ts";
 * import { SECOND, MINUTE, HOUR } from "std/datetime/constants.ts";
 *
 * timeAgo(new Date()); // Returns "just now"
 * timeAgo(new Date(Date.now() - 3 * HOUR)); // Returns "3 hours ago"
 * ```
 */
export function timeAgo(date: Date) {
  const now = new Date();

  if (date > now) {
    throw new Error("Timestamp must be in the past");
  }

  const match = Object.entries(
    difference(now, date, {
      // These units make sense for a web UI
      units: [
        "seconds",
        "minutes",
        "hours",
        "days",
        "weeks",
        "months",
        "years",
      ],
    }),
  )
    .toReversed()
    .find(([_, amount]) => amount > 0);

  if (match === undefined) {
    return "şimdi";
  }

  const [unit, amount] = match;

  const unitMapping: Record<Unit, string> = {
    milliseconds: "milisaniye",
    seconds: "saniye",
    minutes: "dakika",
    hours: "saat",
    days: "gün",
    weeks: "hafta",
    months: "ay",
    quarters: "çeyrek",
    years: "yıl",
  };

  return `${pluralize(amount, unitMapping[<Unit> unit])} önce`;
}

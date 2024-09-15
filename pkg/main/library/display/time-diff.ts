// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as datetimeDifference from "@std/datetime/difference";
import { pluralize } from "./pluralize.ts";

/**
 * Returns how long ago a given date is from now.
 *
 * @example
 * ```ts
 * import * as datetimeConstants from "@std/datetime/constants";
 * import { timeDiff } from "@/pkg/main/library/display/time-diff.ts";
 *
 * timeDiff(new Date()); // Returns "şimdi"
 * timeDiff(new Date(Date.now() - 3 * datetimeConstants.HOUR)); // Returns "3 saat önce"
 * ```
 */
export const timeDiff = (date: Date) => {
  const now = new Date();
  const isPast = date < now;

  const match = Object.entries(
    datetimeDifference.difference(now, date, {
      // These units make sense for a web UI
      units: ["seconds", "minutes", "hours", "days", "weeks", "months", "years"],
    }),
  )
    .toReversed()
    .find(([_, amount]) => amount > 0);

  if (match === undefined) {
    return "şimdi";
  }

  const [unit, amount] = match;

  if (unit === "seconds" && amount < 10) {
    return "şimdi";
  }

  if (unit === "days" && amount === 1) {
    return isPast ? "dün" : "yarın";
  }

  const unitMapping: Record<datetimeDifference.Unit, string> = {
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

  return `${pluralize(amount, unitMapping[<datetimeDifference.Unit> unit])} ${isPast ? "önce" : "sonra"}`;
};

// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

/**
 * Returns an array of formatted date and time strings based on the given Date object.
 * Uses the `tr-TR` locale and `Europe/Istanbul` timezone.
 *
 * The returned array contains four elements:
 * 1. Day of the month (2-digit)
 * 2. Month name (long format)
 * 3. Year (numeric)
 * 4. Time (24-hour format, hours and minutes)
 *
 * @param {Date} date - The date to format
 * @returns {[string, string, string, string]} An array of formatted date and time strings
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat|Intl.DateTimeFormat}
 *
 * @example
 * ```ts
 * import { formatDateTime } from "@/pkg/main/library/display/format-datetime.ts";
 *
 * const [day, month, year, time] = formatDateTime(new Date());
 * console.log(`${day} ${month} ${year}, ${time}`); // e.g., "15 Haziran 2023, 14:30"
 * ```
 */
export const formatDateTime = (date: Date): [string, string, string, string] => {
  const part1formatter = new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    hour12: false,
    timeZone: "Europe/Istanbul",
  });

  const part2formatter = new Intl.DateTimeFormat("tr-TR", {
    month: "long",
    hour12: false,
    timeZone: "Europe/Istanbul",
  });

  const part3formatter = new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    hour12: false,
    timeZone: "Europe/Istanbul",
  });

  const part4formatter = new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Istanbul",
  });

  return [
    part1formatter.format(date),
    part2formatter.format(date),
    part3formatter.format(date),
    part4formatter.format(date),
  ];
};

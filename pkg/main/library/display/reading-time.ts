// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

/**
 * Calculates the reading time in seconds for a given content.
 *
 * @param content - The text content to calculate reading time for.
 * @param wordsPerSecond - The average number of words read per second (default: 3.33).
 * @returns The estimated reading time in seconds.
 *
 * @example
 * ```ts
 * import { readingTime } from "@/pkg/main/library/display/reading-time.ts";
 *
 * const content = "This is a sample text to calculate reading time.";
 * const time = readingTime(content); // Returns the estimated reading time in seconds
 * ```
 */
export const readingTime = (content: string, wordsPerSecond = 3.33) => {
  const wordCount = content.trim().split(/\s+/).length;
  const readingTimeSeconds = Math.ceil(wordCount / wordsPerSecond);

  return readingTimeSeconds;
};

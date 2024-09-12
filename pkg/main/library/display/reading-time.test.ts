// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as assert from "@std/assert";
import { readingTime } from "./reading-time.ts";

Deno.test("[display] readingTime()", () => {
  // Test with default words per second (3.33)
  assert.assertEquals(readingTime("This is a short sentence."), 2);
  assert.assertEquals(readingTime("This is a longer sentence with more words to read."), 4);

  // Test with empty string
  assert.assertEquals(readingTime(""), 1);

  // Test with custom words per second
  assert.assertEquals(readingTime("This is a test sentence.", 2), 3);
  assert.assertEquals(readingTime("This is another test sentence with more words.", 8), 1);
});

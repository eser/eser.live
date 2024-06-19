// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { pluralize } from "./pluralize.ts";
import { assertEquals } from "std/assert/mod.ts";

Deno.test("[display] pluralize()", () => {
  assertEquals(pluralize(0, "nesne"), "0 nesne");
  assertEquals(pluralize(1, "nesne"), "1 nesne");
  assertEquals(pluralize(2, "nesne"), "2 nesne");
});

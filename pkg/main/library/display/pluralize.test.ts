// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as assert from "@std/assert";
import { pluralize } from "./pluralize.ts";

Deno.test("[display] pluralize()", () => {
  assert.assertEquals(pluralize(0, "nesne"), "0 nesne");
  assert.assertEquals(pluralize(1, "nesne"), "1 nesne");
  assert.assertEquals(pluralize(2, "nesne"), "2 nesne");
});

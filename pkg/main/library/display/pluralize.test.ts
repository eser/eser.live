// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as assert from "@std/assert";
import { pluralize } from "./pluralize.ts";

Deno.test("[display] pluralize()", () => {
  assert.assertEquals(pluralize(0, "nesne"), "0 nesne");
  assert.assertEquals(pluralize(1, "nesne"), "1 nesne");
  assert.assertEquals(pluralize(2, "nesne"), "2 nesne");
});

// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as assert from "@std/assert";
import { formatCurrency } from "./format-currency.ts";

Deno.test("[display] formatCurrency()", () => {
  assert.assertEquals(formatCurrency(5, "USD"), "$5");
});

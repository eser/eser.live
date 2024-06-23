// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as assert from "@std/assert";
import { formatCurrency } from "./format-currency.ts";

Deno.test("[display] formatCurrency()", () => {
  assert.assertEquals(formatCurrency(5, "USD"), "$5");
});

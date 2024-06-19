// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { formatCurrency } from "./format-currency.ts";
import { assertEquals } from "std/assert/mod.ts";

Deno.test("[display] formatCurrency()", () => {
  assertEquals(formatCurrency(5, "USD"), "$5");
});

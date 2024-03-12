// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { formatCurrency, pluralize, timeAgo } from "./display.ts";
import { DAY, HOUR, MINUTE, SECOND } from "std/datetime/constants.ts";
import { assertEquals, assertThrows } from "std/assert/mod.ts";

Deno.test("[display] pluralize()", () => {
  assertEquals(pluralize(0, "nesne"), "0 nesne");
  assertEquals(pluralize(1, "nesne"), "1 nesne");
  assertEquals(pluralize(2, "nesne"), "2 nesne");
});

Deno.test("[display] timeAgo()", () => {
  assertEquals(timeAgo(new Date(Date.now())), "şimdi");
  assertEquals(timeAgo(new Date(Date.now() - SECOND * 30)), "30 saniye önce");
  assertEquals(timeAgo(new Date(Date.now() - MINUTE)), "1 dakika önce");
  assertEquals(timeAgo(new Date(Date.now() - MINUTE * 2)), "2 dakika önce");
  assertEquals(timeAgo(new Date(Date.now() - MINUTE * 59)), "59 dakika önce");
  assertEquals(timeAgo(new Date(Date.now() - HOUR)), "1 saat önce");
  assertEquals(
    timeAgo(new Date(Date.now() - HOUR - MINUTE * 35)),
    "1 saat önce",
  );
  assertEquals(timeAgo(new Date(Date.now() - HOUR * 2)), "2 saat önce");
  assertEquals(timeAgo(new Date(Date.now() - DAY)), "1 gün önce");
  assertEquals(timeAgo(new Date(Date.now() - DAY - HOUR * 12)), "1 gün önce");
  assertEquals(timeAgo(new Date(Date.now() - DAY * 5)), "5 gün önce");
  assertThrows(
    () => timeAgo(new Date(Date.now() + 1)),
    Error,
    "Timestamp must be in the past",
  );
});

Deno.test("[display] formatCurrency()", () => {
  assertEquals(formatCurrency(5, "USD"), "$5");
});

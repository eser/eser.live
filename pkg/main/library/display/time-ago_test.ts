// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { timeAgo } from "./time-ago.ts";
import { DAY, HOUR, MINUTE, SECOND } from "std/datetime/constants.ts";
import { assertEquals, assertThrows } from "std/assert/mod.ts";

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

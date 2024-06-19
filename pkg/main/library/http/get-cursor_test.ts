// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "std/assert/mod.ts";
import { getCursor } from "./get-cursor.ts";

Deno.test("[http] getCursor()", () => {
  assertEquals(getCursor(new URL("http://example.com")), "");
  assertEquals(getCursor(new URL("http://example.com?cursor=here")), "here");
});

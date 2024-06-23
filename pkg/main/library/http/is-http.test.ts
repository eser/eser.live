// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as assert from "@std/assert";
import { isHttps } from "./is-http.ts";

Deno.test("isHttps()", () => {
  assert.assertEquals(isHttps("https://example.com"), true);
  assert.assertEquals(isHttps("http://example.com"), false);
});

// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as assert from "@std/assert";
import { isHttps } from "./is-http.ts";

Deno.test("isHttps()", () => {
  assert.assertEquals(isHttps("https://example.com"), true);
  assert.assertEquals(isHttps("http://example.com"), false);
});

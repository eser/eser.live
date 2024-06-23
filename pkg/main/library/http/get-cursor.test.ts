// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as assert from "@std/assert";
import { getCursor } from "./get-cursor.ts";

Deno.test("[http] getCursor()", () => {
  assert.assertEquals(getCursor(new URL("http://example.com")), "");
  assert.assertEquals(
    getCursor(new URL("http://example.com?cursor=here")),
    "here",
  );
});

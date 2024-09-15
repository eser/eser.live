// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as assert from "@std/assert";
import { getCursor } from "./cursors.ts";

Deno.test("[cursors] getCursor()", () => {
  assert.assertObjectMatch(getCursor("http://example.com", 10), {
    offset: "",
    pageSize: 10,
  });
  assert.assertObjectMatch(getCursor("http://example.com?cursor=here", 15), {
    offset: "here",
    pageSize: 15,
  });
});

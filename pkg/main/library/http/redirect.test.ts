// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as assert from "@std/assert";
import * as httpStatus from "@std/http/status";
import { redirect } from "./redirect.ts";

export const assertRedirect = (
  response: Response,
  statusCode: httpStatus.StatusCode = httpStatus.STATUS_CODE.SeeOther,
  location?: string,
) => {
  assert.assert(!response.ok);
  assert.assertEquals(response.body, null);
  assert.assertEquals(response.status, statusCode);

  if (location !== undefined) {
    assert.assertEquals(response.headers.get("location"), location);
  } else {
    assert.assert(response.headers.has("location"));
  }
};

Deno.test("[http] redirect() defaults", () => {
  const location = "/hello-there";

  const resp = redirect(location);
  assertRedirect(resp, httpStatus.STATUS_CODE.SeeOther, location);
});

Deno.test("[http] redirect()", () => {
  const location = "/hello-there";
  const status = httpStatus.STATUS_CODE.Found;

  const resp = redirect(location, status);
  assertRedirect(resp, status, location);
});

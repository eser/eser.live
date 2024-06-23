// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as ulid from "@std/ulid";
import * as assert from "@std/assert";
import {
  getAndDeleteOAuthSession,
  type OAuthSession,
  setOAuthSession,
} from "./_kv.ts";

function randomOAuthSession(): OAuthSession {
  return {
    state: ulid.ulid(),
    codeVerifier: ulid.ulid(),
    successUrl: `http://${ulid.ulid()}.com`,
  };
}

Deno.test("(getAndDelete/set)OAuthSession()", async () => {
  const id = ulid.ulid();

  // OAuth session doesn't yet exist
  await assert.assertRejects(
    async () => await getAndDeleteOAuthSession(id),
    Deno.errors.NotFound,
    "OAuth session not found",
  );

  const oauthSession = randomOAuthSession();
  await setOAuthSession(id, oauthSession, 1_000);

  assert.assertEquals(await getAndDeleteOAuthSession(id), oauthSession);
  await assert.assertRejects(
    async () => await getAndDeleteOAuthSession(id),
    Deno.errors.NotFound,
    "OAuth session not found",
  );
});

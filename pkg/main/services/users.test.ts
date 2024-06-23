// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as assert from "@std/assert";
import * as ulid from "@std/ulid";
import {
  createUser,
  getUser,
  getUserBySession,
  randomUser,
  // updateUser,
  updateUserSession,
  // type User,
} from "./users.ts";

Deno.test("[db] user", async () => {
  const user = randomUser();

  assert.assertEquals(await getUser(user.login), null);
  assert.assertEquals(await getUserBySession(user.sessionId), null);

  await createUser(user);
  await assert.assertRejects(async () => await createUser(user));
  assert.assertEquals(await getUser(user.login), user);
  assert.assertEquals(await getUserBySession(user.sessionId), user);

  const newSessionId = ulid.ulid();
  await updateUserSession(user, newSessionId);
  assert.assertEquals(await getUserBySession(user.sessionId), null);
  assert.assertEquals(await getUserBySession(newSessionId), {
    ...user,
    sessionId: newSessionId,
  });

  await assert.assertRejects(
    async () => await updateUserSession(user, newSessionId),
    Error,
    "Failed to update user session",
  );
});

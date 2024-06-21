// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { assertEquals, assertRejects } from "std/assert/mod.ts";
import { ulid } from "std/ulid/mod.ts";
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

  assertEquals(await getUser(user.login), null);
  assertEquals(await getUserBySession(user.sessionId), null);

  await createUser(user);
  await assertRejects(async () => await createUser(user));
  assertEquals(await getUser(user.login), user);
  assertEquals(await getUserBySession(user.sessionId), user);

  const newSessionId = ulid();
  await updateUserSession(user, newSessionId);
  assertEquals(await getUserBySession(user.sessionId), null);
  assertEquals(await getUserBySession(newSessionId), {
    ...user,
    sessionId: newSessionId,
  });

  await assertRejects(
    async () => await updateUserSession(user, newSessionId),
    Error,
    "Failed to update user session",
  );
});

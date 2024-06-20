// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { kv } from "./db.ts";

// User
export interface User {
  // AKA username
  login: string;
  sessionId: string;
}

/** For testing */
export function randomUser(login?: string): User {
  return {
    login: login ?? crypto.randomUUID(),
    sessionId: crypto.randomUUID(),
  };
}

/**
 * Creates a new user in the database. Throws if the user or user session
 * already exists.
 *
 * @example
 * ```ts
 * import { createUser } from "@/pkg/main/services/users.ts";
 *
 * await createUser({
 *   login: "john",
 *   sessionId: crypto.randomUUID(),
 * });
 * ```
 */
export async function createUser(user: User) {
  const usersKey = ["users", user.login];
  const usersBySessionKey = ["users_by_session", user.sessionId];

  const atomicOp = kv.atomic()
    .check({ key: usersKey, versionstamp: null })
    .check({ key: usersBySessionKey, versionstamp: null })
    .set(usersKey, user)
    .set(usersBySessionKey, user);

  const res = await atomicOp.commit();

  if (!res.ok) {
    throw new Error("Failed to create user");
  }
}

/**
 * Creates a user in the database, overwriting any previous data.
 *
 * @example
 * ```ts
 * import { updateUser } from "@/pkg/main/services/users.ts";
 *
 * await updateUser({
 *   login: "john",
 *   sessionId: crypto.randomUUID(),
 * });
 * ```
 */
export async function updateUser(user: User) {
  const usersKey = ["users", user.login];
  const usersBySessionKey = ["users_by_session", user.sessionId];

  const atomicOp = kv.atomic()
    .set(usersKey, user)
    .set(usersBySessionKey, user);

  const res = await atomicOp.commit();
  if (!res.ok) throw new Error("Failed to update user");
}

/**
 * Updates the session ID of a given user in the database.
 *
 * @example
 * ```ts
 * import { updateUserSession } from "@/pkg/main/services/users.ts";
 *
 * await updateUserSession({
 *   login: "john",
 *   sessionId: "xxx",
 * }, "yyy");
 * ```
 */
export async function updateUserSession(user: User, sessionId: string) {
  const userKey = ["users", user.login];
  const oldUserBySessionKey = ["users_by_session", user.sessionId];
  const newUserBySessionKey = ["users_by_session", sessionId];
  const newUser: User = { ...user, sessionId };

  const atomicOp = kv.atomic()
    .set(userKey, newUser)
    .delete(oldUserBySessionKey)
    .check({ key: newUserBySessionKey, versionstamp: null })
    .set(newUserBySessionKey, newUser);

  const res = await atomicOp.commit();
  if (!res.ok) throw new Error("Failed to update user session");
}

/**
 * Gets the user with the given login from the database.
 *
 * @example
 * ```ts
 * import { getUser } from "@/pkg/main/services/users.ts";
 *
 * const user = await getUser("jack");
 * user?.login; // Returns "jack"
 * user?.sessionId; // Returns "xxx"
 * ```
 */
export async function getUser(login: string) {
  const res = await kv.get<User>(["users", login]);
  return res.value;
}

/**
 * Gets the user with the given session ID from the database. The first attempt
 * is done with eventual consistency. If that returns `null`, the second
 * attempt is done with strong consistency. This is done for performance
 * reasons, as this function is called in every route request for checking
 * whether the session user is logged in.
 *
 * @example
 * ```ts
 * import { getUserBySession } from "@/pkg/main/services/users.ts";
 *
 * const user = await getUserBySession("xxx");
 * user?.login; // Returns "jack"
 * user?.sessionId; // Returns "xxx"
 * ```
 */
export async function getUserBySession(sessionId: string) {
  const key = ["users_by_session", sessionId];
  const eventualRes = await kv.get<User>(key, {
    consistency: "eventual",
  });
  if (eventualRes.value !== null) return eventualRes.value;
  const res = await kv.get<User>(key);
  return res.value;
}

/**
 * Returns a {@linkcode Deno.KvListIterator} which can be used to iterate over
 * the users in the database.
 *
 * @example
 * ```ts
 * import { listUsers } from "@/pkg/main/services/users.ts";
 *
 * for await (const entry of listUsers()) {
 *   entry.value.login; // Returns "jack"
 *   entry.value.sessionId; // Returns "xxx"
 * }
 * ```
 */
export function listUsers(options?: Deno.KvListOptions) {
  return kv.list<User>({ prefix: ["users"] }, options);
}

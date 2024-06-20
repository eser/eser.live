// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
const DENO_KV_PATH_KEY = "DENO_KV_PATH";

let path = undefined;
if (
  (await Deno.permissions.query({ name: "env", variable: DENO_KV_PATH_KEY }))
    .state === "granted"
) {
  path = Deno.env.get(DENO_KV_PATH_KEY);
}

export const kv = await Deno.openKv(path);

// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as dotenv from "@std/dotenv";

async function readEnvKey(key: string): Promise<string | undefined> {
  let value = undefined;

  if (
    (await Deno.permissions.query({ name: "env", variable: key }))
      .state === "granted"
  ) {
    value = Deno.env.get(key);
  }

  return value;
}

await dotenv.load({ export: true });

export const denoKvPath = await readEnvKey("DENO_KV_PATH");
export const kv = await Deno.openKv(denoKvPath);

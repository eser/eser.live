// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { load } from "std/dotenv/mod.ts";
import { schema } from "./schema.ts";

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

await load({ export: true });

export const postgresConnStr = await readEnvKey("POSTGRES_CONNSTR") ??
  "postgres://0.0.0.0:5432/postgres";
export const postgresClient = postgres(postgresConnStr);

export const db = drizzle(postgresClient, { schema });

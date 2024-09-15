// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as dotenv from "@std/dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.ts";

const readEnvKey = async (key: string): Promise<string | undefined> => {
  let value = undefined;

  if ((await Deno.permissions.query({ name: "env", variable: key })).state === "granted") {
    value = Deno.env.get(key);
  }

  return value;
};

await dotenv.load({ export: true });

export const postgresConnStr = (await readEnvKey("POSTGRES_CONNSTR")) ?? "postgres://0.0.0.0:5432/postgres";
export const postgresClient = postgres(postgresConnStr);

// @ts-ignore type incompatibility
export const db = drizzle(postgresClient, { schema });

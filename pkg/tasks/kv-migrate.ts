// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
// import { migrate } from "drizzle-orm/postgres-js/migrator";
// import { db, postgresClient } from "@/pkg/main/data/db.ts";
// import config from "../../drizzle.config.ts";

import * as dotenv from "jsr:@std/dotenv";

// "questions",
// "questions_by_user",
// "questions_voted_by_user",
// "site_sessions",
// "users",
// "users_by_session",
// "users_voted_for_question"

const main = async () => {
  await dotenv.load({ export: true });

  const connectionString = Deno.env.get("DENO_KV_PATH");
  const kv = await Deno.openKv(connectionString);

  for await (const { key, value } of kv.list({ prefix: ["users"] })) {
    console.log(key, value);
  }
};

main();

// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
// import { migrate } from "drizzle-orm/postgres-js/migrator";
// import { db, postgresClient } from "@/pkg/main/data/db.ts";
// import config from "../../drizzle.config.ts";

// import * as ulid from "@std/ulid";
import * as dotenv from "@std/dotenv";
// import * as github from "@/pkg/main/services/github.ts";
// import * as users from "@/pkg/main/data/repositories/users.ts";

// "questions",
// "questions_by_user",
// "questions_voted_by_user",
// "site_sessions",
// "users",
// "users_by_session",
// "users_voted_for_question"

// const conversionList: Record<string, string | null> = {
//   "01J129HQ4JGS16C4EHC0EQJ9F4": null,
//   "01J129HNJ7M997MTJT9GFAP8TM": null,
//   "01J129HRRBTWCRSVNWZHHK6K1A": null,
//   // "eser": null,
// };

const main = async () => {
  await dotenv.load({ export: true });

  // const githubToken = Deno.env.get("GITHUB_TOKEN");
  const kvPath = Deno.env.get("DENO_KV_PATH");

  const kv = await Deno.openKv(kvPath);

  // deno-lint-ignore no-explicit-any
  const list = kv.list<any>({ prefix: ["questions"] });
  for await (const { key, value } of list) {
    console.log(key, value);
    // const login: string | null = value.login in conversionList
    //   ? conversionList[value.login]
    //   : value.login;

    // if (login === null) {
    //   continue;
    // }

    // try {
    //   const user = await users.userRepository.findByGitHubHandle(login);

    //   if (user === undefined) {
    //     continue;
    //   }

    //   console.log(user.email);
    // } catch (error) {
    //   console.error("ERROR", error);
    // }
  }

  kv.close();
};

main();

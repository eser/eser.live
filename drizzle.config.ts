// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./pkg/main/data/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: Deno.env.get("POSTGRES_CONNSTR") ?? "",
  },
  verbose: true,
  strict: true,
});

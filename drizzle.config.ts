// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
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

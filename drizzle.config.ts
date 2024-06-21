import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./pkg/main/data/models/*",
  out: "./drizzle",
  dbCredentials: {
    url: Deno.env.get("POSTGRES_CONNSTR") ?? "",
  },
  verbose: true,
  strict: true,
});

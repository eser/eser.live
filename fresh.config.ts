// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import tailwindPlugin from "$fresh/plugins/tailwind.ts";
import kvOAuthPlugin from "./plugins/kv-oauth.ts";
import sessionPlugin from "./plugins/session.ts";
import errorHandling from "./plugins/error-handling.ts";
import securityHeaders from "./plugins/security-headers.ts";
import { defineConfig } from "$fresh/server.ts";

export default defineConfig(
  {
    plugins: [
      kvOAuthPlugin,
      sessionPlugin,
      tailwindPlugin(),
      errorHandling,
      securityHeaders,
    ],
  },
);

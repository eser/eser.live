// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import tailwindPlugin from "$fresh/plugins/tailwind.ts";
import kvOAuthPlugin from "@/pkg/main/plugins/kv-oauth.ts";
import sessionPlugin from "@/pkg/main/plugins/session.ts";
import errorHandling from "@/pkg/main/plugins/error-handling.ts";
import securityHeaders from "@/pkg/main/plugins/security-headers.ts";
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
    router: {
      trailingSlash: true,
    },
  },
);

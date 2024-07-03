// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import tailwindPlugin from "$fresh/plugins/tailwind.ts";
import { oAuthPlugin } from "@/pkg/main/plugins/oauth.ts";
import { sessionPlugin } from "@/pkg/main/plugins/session.ts";
import { errorHandlingPlugin } from "@/pkg/main/plugins/error-handling.ts";
import { securityHeadersPlugin } from "@/pkg/main/plugins/security-headers.ts";
import { defineConfig } from "$fresh/server.ts";

export default defineConfig(
  {
    plugins: [
      oAuthPlugin,
      sessionPlugin,
      tailwindPlugin(),
      errorHandlingPlugin,
      securityHeadersPlugin,
    ],
    router: {
      trailingSlash: true,
    },
  },
);

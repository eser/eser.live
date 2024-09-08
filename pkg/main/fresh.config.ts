// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import tailwindPlugin from "$fresh/plugins/tailwind.ts";
import { oAuthPlugin } from "@/pkg/main/plugins/oauth.ts";
import { sessionPlugin } from "@/pkg/main/plugins/session.ts";
import { errorHandlingPlugin } from "@/pkg/main/plugins/error-handling.ts";
import { securityHeadersPlugin } from "@/pkg/main/plugins/security-headers.ts";
import { defineConfig, type Plugin } from "$fresh/server.ts";

export default defineConfig(
  {
    plugins: [
      oAuthPlugin,
      sessionPlugin as Plugin,
      tailwindPlugin(),
      errorHandlingPlugin as Plugin,
      securityHeadersPlugin,
    ],
    router: {
      trailingSlash: true,
    },
  },
);

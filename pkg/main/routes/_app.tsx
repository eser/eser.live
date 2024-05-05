// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { type State } from "@/pkg/main/plugins/session.ts";
import { defineApp } from "$fresh/server.ts";

export default defineApp<State>((_req, ctx) => {
  return (
    <html class="theme-default">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="anonymous"
        />

        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/global.css" />
        <link rel="stylesheet" href="/theme-default.css" />
      </head>
      <body>
        <ctx.Component />
      </body>
    </html>
  );
});

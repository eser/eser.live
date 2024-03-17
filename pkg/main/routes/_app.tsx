// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { type State } from "@/pkg/main/plugins/session.ts";
import { defineApp } from "$fresh/server.ts";

export default defineApp<State>((_req, ctx) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <ctx.Component />
      </body>
    </html>
  );
});

// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { defineApp } from "$fresh/server.ts";
import { type State, stateDefaults } from "@/pkg/main/plugins/session.ts";

export default defineApp<State>((_req, ctx) => {
  // defaults
  const state = {
    ...stateDefaults,
    ...ctx.state,
  };

  return (
    <html class={`theme-${state.theme}`} lang={state.lang}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />

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

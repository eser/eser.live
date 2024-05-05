// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { defineLayout } from "$fresh/server.ts";
import { Header } from "@/pkg/main/components/header.tsx";
import { Footer } from "@/pkg/main/components/footer.tsx";
import { type State } from "@/pkg/main/plugins/session.ts";
import { Shortcuts } from "@/pkg/main/islands/shortcuts.tsx";

export default defineLayout<State>((_req, ctx) => {
  return (
    <>
      <Shortcuts />
      <Header
        url={ctx.url}
        sessionUser={ctx.state?.sessionUser}
      />
      <ctx.Component />
      <Footer />
    </>
  );
});

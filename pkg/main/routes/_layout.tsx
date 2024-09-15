// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { defineLayout } from "$fresh/server.ts";
import type { State } from "@/pkg/main/plugins/session.ts";
import { Footer } from "@/pkg/main/routes/(common)/(_components)/footer.tsx";
import { Header } from "@/pkg/main/routes/(common)/(_components)/header.tsx";
import { Shortcuts } from "@/pkg/main/routes/(common)/(_islands)/shortcuts.tsx";

export default defineLayout<State>((_req, ctx) => {
  return (
    <>
      <Shortcuts />
      <Header url={ctx.url} sessionUser={ctx.state.sessionUser} />
      <ctx.Component />
      <Footer />
    </>
  );
});

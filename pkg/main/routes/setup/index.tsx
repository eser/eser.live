// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { defineRoute } from "$fresh/server.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";

export default defineRoute<State>((_req, ctx) => {
  return (
    <>
      <Head title="Setup" href={ctx.url.href} />
      <main>
        <div class="content-area">
          <h1>Setup</h1>
          <em>
            Bu sayfa henüz tamamlanmamıştır.
          </em>
        </div>
      </main>
    </>
  );
});

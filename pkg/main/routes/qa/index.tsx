// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { defineRoute } from "$fresh/server.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { QuestionsList } from "@/pkg/main/routes/(common)/(_islands)/questions-list.tsx";

export default defineRoute<State>((_req, ctx) => {
  const isLoggedIn = ctx.state.sessionUser !== null;
  const isEditor = ctx.state.isEditor;
  const endpoint = "/api/questions";

  return (
    <>
      <Head title="Soru / Yanıt" href={ctx.url.href}>
        <link
          as="fetch"
          crossOrigin="anonymous"
          href={endpoint}
          rel="preload"
        />
        {isLoggedIn && (
          <link
            as="fetch"
            crossOrigin="anonymous"
            href="/api/me/question-votes"
            rel="preload"
          />
        )}
      </Head>
      <main>
        <div class="content-area">
          <h1>Soru / Yanıt</h1>
          <QuestionsList
            endpoint={endpoint}
            isLoggedIn={isLoggedIn}
            isEditor={isEditor}
          />
        </div>
      </main>
    </>
  );
});

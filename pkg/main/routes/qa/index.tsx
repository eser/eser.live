// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { defineRoute } from "$fresh/server.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/components/head.tsx";
import { QuestionsList } from "@/pkg/main/islands/questions-list.tsx";

export default defineRoute<State>((_req, ctx) => {
  const isLoggedIn = ctx.state.sessionUser !== undefined;
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
        <div>
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

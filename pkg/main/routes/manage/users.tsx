// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import Head from "@/pkg/main/components/head.tsx";
import TabsBar from "@/pkg/main/components/tabs-bar.tsx";
import { HEADING_WITH_MARGIN_STYLES } from "@/pkg/main/utils/constants.ts";
import UsersTable from "@/pkg/main/islands/users-table.tsx";
import { type State } from "@/pkg/main/plugins/session.ts";
import { defineRoute } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";

export default defineRoute<State>((_req, ctx) => {
  const endpoint = "/api/users";

  return (
    <>
      <Head title="Kullanıcılar" href={ctx.url.href}>
        <link
          as="fetch"
          crossOrigin="anonymous"
          href={endpoint}
          rel="preload"
        />
      </Head>
      <main class="flex-1 p-4 f-client-nav">
        <h1 class={HEADING_WITH_MARGIN_STYLES}>Editor Paneli</h1>
        <TabsBar
          links={[{
            path: "/manage/stats",
            innerText: "İstatistikler",
          }, {
            path: "/manage/users",
            innerText: "Kullanıcılar",
          }]}
          currentPath={ctx.url.pathname}
        />
        <Partial name="users">
          <UsersTable endpoint={endpoint} />
        </Partial>
      </main>
    </>
  );
});

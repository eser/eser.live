// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { TabsBar } from "@/pkg/main/routes/(common)/(_components)/tabs-bar.tsx";
import { UsersTable } from "@/pkg/main/routes/(common)/(_islands)/users-table.tsx";
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
      <main>
        <div class="content-area">
          <h1>Panel</h1>
          <TabsBar
            links={[
              {
                path: "/dash",
                innerText: "Hesabım",
                isVisible: true,
              },
              {
                path: "/dash/stats/",
                innerText: "İstatistikler",
                isVisible: (ctx.state.isEditor === true),
              },
              {
                path: "/dash/users/",
                innerText: "Kullanıcılar",
                isVisible: (ctx.state.isEditor === true),
              },
            ]}
            currentPath={ctx.url.pathname}
          />
          <Partial name="users">
            <UsersTable endpoint={endpoint} />
          </Partial>
        </div>
      </main>
    </>
  );
});

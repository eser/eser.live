// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { Head } from "@/pkg/main/components/head.tsx";
import { TabsBar } from "@/pkg/main/components/tabs-bar.tsx";
import { UsersTable } from "@/pkg/main/islands/users-table.tsx";
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
        <div>
          <h1>Panel</h1>
          <TabsBar
            links={[
              {
                path: "/dash",
                innerText: "Hesabım",
                isVisible: true,
              },
              {
                path: "/dash/stats",
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

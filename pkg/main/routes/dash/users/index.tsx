// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { Partial } from "$fresh/runtime.ts";
import { defineRoute } from "$fresh/server.ts";
import type { State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { TabsBar } from "@/pkg/main/routes/(common)/(_components)/tabs-bar.tsx";
// import { UsersTable } from "@/pkg/main/routes/(common)/(_islands)/users-table.tsx";

export default defineRoute<State>((_req, ctx) => {
  return (
    <>
      <Head title="Kullanıcılar" href={ctx.url.href} />
      <main>
        <div class="content-area">
          <h1>Panel</h1>
          <TabsBar
            links={[
              {
                path: "/dash/",
                innerText: "Hesabım",
                isVisible: true,
              },
              {
                path: "/dash/stats/",
                innerText: "İstatistikler",
                isVisible: ctx.state.isEditor === true,
              },
              {
                path: "/dash/users/",
                innerText: "Kullanıcılar",
                isVisible: ctx.state.isEditor === true,
              },
            ]}
            currentPath={ctx.url.pathname}
          />
          <Partial name="users">
            Kullanıcılar
            {/* <UsersTable endpoint={endpoint} /> */}
          </Partial>
        </div>
      </main>
    </>
  );
});

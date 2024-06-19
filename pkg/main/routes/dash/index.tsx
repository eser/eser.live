// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { defineRoute } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { TabsBar } from "@/pkg/main/routes/(common)/(_components)/tabs-bar.tsx";
import { GitHubAvatarImg } from "@/pkg/main/routes/(common)/(_components)/github-avatar-img.tsx";

export default defineRoute<LoggedInState>((_req, ctx) => {
  return (
    <>
      <Head title="Hesap" href={ctx.url.href} />
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
          <Partial name="account">
            <div>
              <GitHubAvatarImg
                login={ctx.state.sessionUser.login}
                size={240}
                class="mx-auto"
              />
              <ul class="space-y-4">
                <li>
                  <strong>Kullanıcı</strong>
                  <p class="flex flex-wrap justify-between">
                    <span>
                      {ctx.state.sessionUser.login}
                    </span>
                  </p>
                </li>
              </ul>
              <div class="my-10 flex flex-row gap-6 justify-center">
                <a
                  href="/auth/logout?success_url=/"
                  class="btn btn-neutral"
                >
                  Oturumu sonlandır
                </a>

                <a
                  href={`/dash/users/${ctx.state.sessionUser.login}`}
                  class="btn btn-neutral"
                >
                  Profilime git &#8250;
                </a>
              </div>
            </div>
          </Partial>
        </div>
      </main>
    </>
  );
});

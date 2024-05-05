// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { defineRoute } from "$fresh/server.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/components/head.tsx";
import { TabsBar } from "@/pkg/main/components/tabs-bar.tsx";
import { GitHubAvatarImg } from "@/pkg/main/components/github-avatar-img.tsx";
import { Partial } from "$fresh/runtime.ts";

const PRIMARY_BUTTON_STYLE =
  "flex flex-row gap-2 text-center text-white rounded-lg bg-primary px-4 py-2";

const SECONDARY_BUTTON_STYLE =
  "flex flex-row gap-2 text-center text-white rounded-lg bg-secondary px-4 py-2";

export default defineRoute<LoggedInState>((_req, ctx) => {
  return (
    <>
      <Head title="Hesap" href={ctx.url.href} />
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
                  class={PRIMARY_BUTTON_STYLE}
                >
                  Oturumu sonlandır
                </a>

                <a
                  href={`/dash/users/${ctx.state.sessionUser.login}`}
                  class={SECONDARY_BUTTON_STYLE}
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

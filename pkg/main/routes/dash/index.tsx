// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { Partial } from "$fresh/runtime.ts";
import { defineRoute } from "$fresh/server.ts";
import type { LoggedInState } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { TabsBar } from "@/pkg/main/routes/(common)/(_components)/tabs-bar.tsx";
import { UserProfilePicture } from "@/pkg/main/routes/(common)/(_components)/user-profile-picture.tsx";

// this endpoint is executed after ensureLoggedIn middleware has allowed it to pass
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
          <Partial name="account">
            <div>
              <UserProfilePicture user={ctx.state.sessionUser} isAnonymous={false} size={240} class="mx-auto" />
              <ul class="space-y-4">
                <li>
                  <strong>Kullanıcı</strong>
                  <p class="flex flex-wrap justify-between">
                    <span>{ctx.state.sessionUser.name}</span>
                  </p>
                </li>
              </ul>
              <div class="my-10 flex flex-row gap-6 justify-center">
                <a href="/auth/logout?successUri=/" class="btn btn-primary">
                  Oturumu sonlandır
                </a>

                <a href={`/dash/users/${ctx.state.sessionUser.id}`} class="btn btn-primary">
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

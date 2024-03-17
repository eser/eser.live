// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { defineRoute } from "$fresh/server.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import Head from "@/pkg/main/components/head.tsx";
import GitHubAvatarImg from "@/pkg/main/components/github-avatar-img.tsx";

const PRIMARY_BUTTON_STYLE =
  "flex flex-row gap-2 text-center text-white rounded-lg bg-primary px-4 py-2";

const SECONDARY_BUTTON_STYLE =
  "flex flex-row gap-2 text-center text-white rounded-lg bg-secondary px-4 py-2";

export default defineRoute<LoggedInState>((_req, ctx) => {
  const { sessionUser } = ctx.state;

  return (
    <>
      <Head title="Hesap" href={ctx.url.href} />
      <main class="max-w-lg m-auto w-full flex-1 p-4 flex flex-col justify-center gap-8">
        <GitHubAvatarImg
          login={sessionUser.login}
          size={240}
          class="mx-auto"
        />
        <ul class="space-y-4">
          <li>
            <strong>Kullanıcı</strong>
            <p class="flex flex-wrap justify-between">
              <span>
                {sessionUser.login}
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
            href={`/users/${sessionUser.login}`}
            class={SECONDARY_BUTTON_STYLE}
          >
            Profilime git &#8250;
          </a>
        </div>
      </main>
    </>
  );
});

// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { defineRoute } from "$fresh/src/server/defines.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/components/head.tsx";
import { type User } from "@/pkg/main/utils/db.ts";

interface WelcomeStripProps {
  /** Currently logged-in user */
  sessionUser?: User;
}

function WelcomeStrip(props: WelcomeStripProps) {
  const isAuthenticated = props.sessionUser !== undefined;

  return (
    <div class="p-8 my-2">
      <h1>
        Merhaba {isAuthenticated ? props.sessionUser!.login : "oradaki"}!
      </h1>

      {!isAuthenticated
        ? (
          <>
            <p class="text-slate-600 dark:text-slate-400">
              Bu site{" "}
              <a href="https://www.youtube.com/@eserlive/live">
                Eser Özvataf'ın kişisel YouTube kanalı{" "}
                <span class="bg-green-100 dark:bg-gray-800 p-1 rounded">
                  eser.live
                </span>
              </a>{" "}
              ile ilgili etkileşimli içeriklerin paylaşıldığı bir platform
              olarak tasarlanmıştır. Dilediğinde{" "}
              <span class="bg-green-100 dark:bg-gray-800 p-1 rounded">
                GitHub
              </span>{" "}
              hesabınla giriş yapabilir, ve site üzerinden katılım
              gerçekleştirebilirsin.
            </p>
          </>
        )
        : null}
    </div>
  );
}

export function BroadcastSchedule() {
  return (
    <div class="p-8">
      <h2>Planlı Yayın Takvimi</h2>
      <p>
        <em>Şu anda planlı bir yayın bulunmamaktadır.</em>
      </p>
    </div>
  );
}

export default defineRoute<State>((_req, ctx) => {
  return (
    <>
      <Head href={ctx.url.href} />
      <main>
        <div>
          <WelcomeStrip sessionUser={ctx.state?.sessionUser} />
          <BroadcastSchedule />
        </div>
      </main>
    </>
  );
});

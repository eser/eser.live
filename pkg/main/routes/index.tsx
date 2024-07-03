// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { defineRoute } from "$fresh/src/server/defines.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { type User } from "@/pkg/main/data/models/user.ts";

interface WelcomeStripProps {
  /** Currently logged-in user */
  sessionUser?: User;
}

function WelcomeStrip(props: WelcomeStripProps) {
  const isAuthenticated = props.sessionUser !== undefined;

  return (
    <div class="content-area">
      <div class="hero justify-start">
        <div class="hero-content p-0">
          <div>
            <h1>
              Merhaba {isAuthenticated ? props.sessionUser!.name : "oradaki"}
              {" "}
              👋🏻
            </h1>

            {!isAuthenticated
              ? (
                <p>
                  Bu site{" "}
                  <a href="https://www.youtube.com/@eserlive/live">
                    Eser Özvataf'ın kişisel YouTube kanalı{" "}
                    <span class="highlight">
                      eser.live
                    </span>
                  </a>{" "}
                  ile ilgili etkileşimli içeriklerin paylaşıldığı bir platform
                  olarak tasarlanmıştır. Dilediğinde{" "}
                  <span class="highlight">
                    GitHub
                  </span>{" "}
                  hesabınla giriş yapabilir, ve site üzerinden katılım
                  gerçekleştirebilirsin.
                </p>
              )
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BroadcastSchedule() {
  return (
    <div class="content-area">
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
        <WelcomeStrip sessionUser={ctx.state?.sessionUser} />
        <BroadcastSchedule />
      </main>
    </>
  );
});

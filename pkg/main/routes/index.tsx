// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { defineRoute } from "$fresh/src/server/defines.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { type User } from "@/pkg/main/data/models/user.ts";

interface WelcomeStripProps {
  /** Currently logged-in user */
  sessionUser?: User;
}

export const WelcomeStrip = (props: WelcomeStripProps) => {
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
};

type BroadcastPlaylistCardProps = {
  id: string;
  title: string;
  description: string;
};

export const BroadcastPlaylistCard = (props: BroadcastPlaylistCardProps) => {
  return (
    <a
      href={`https://www.youtube.com/playlist?list=${props.id}`}
      class="no-underline basis-[32%] flex"
    >
      <div class="card glass w-full h-full hover:bg-accent">
        <div class="card-body">
          <h3 class="card-title m-0">{props.title}</h3>
          <p class="m-0">{props.description}</p>
        </div>
      </div>
    </a>
  );
};

export const BroadcastPlaylists = () => {
  return (
    <div class="content-area">
      <h2>Playlistler</h2>
      <div class="flex flex-row flex-wrap gap-4">
        <BroadcastPlaylistCard
          id="PLWLiJPAYmgZAS3xwyNPEGPXZ9rE1ABJzZ"
          title="Yazılımcı Haberleri"
          description="Her pazartesi YouTube’da gerçekleştirdiğimiz canlı yayınlarda haftanın öne çıkan haberleri hakkında konuşuyoruz. Bekleriz."
        />
        <BroadcastPlaylistCard
          id="PLWLiJPAYmgZBKNq3AEH3yR4EPOa2CJYK5"
          title="JavaScript"
          description="JavaScript ekosistemini frameworkleri, kütüphaneleri, standartları ve run-timeları ile full-stack olarak ele aldığımız, incelediğimiz, irdelediğimiz yayınlar."
        />
        <BroadcastPlaylistCard
          id="PLWLiJPAYmgZBLJaOFdjv1cyry82fzvTSA"
          title="Geliştirme Pratikleri"
          description="Günlük olarak kullandığımız birçok teknoloji ve aracın pek bilinmeyen özelliklerini veya üzerinde durulması gereken en iyi uygulamalarını konuştuğumuz videolar."
        />
      </div>
    </div>
  );
};

export const BroadcastSchedule = () => {
  return (
    <div class="content-area">
      <h2>Planlı Yayın Takvimi</h2>
      <p>
        <em>
          Şu anda planlı bir yayın bulunmamaktadır. Anlık yayın bildirimleri
          için Telegram üzerinden{" "}
          <a href="https://t.me/eserlive">
            eser.live ve yazılımcı ağı telegram duyuru kanalı
          </a>nı takip edebilirsiniz.
        </em>
      </p>
    </div>
  );
};

export default defineRoute<State>((_req, ctx) => {
  return (
    <>
      <Head href={ctx.url.href} />
      <main>
        <WelcomeStrip sessionUser={ctx.state?.sessionUser} />
        <BroadcastPlaylists />
        <BroadcastSchedule />
      </main>
    </>
  );
});

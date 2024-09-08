// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { defineRoute } from "$fresh/src/server/defines.ts";
import { type User } from "@/pkg/main/data/user/types.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { EventsList } from "@/pkg/main/routes/(common)/(_islands)/event-list.tsx";

interface WelcomeStripProps {
  /** Currently logged-in user */
  sessionUser: User | null;
}

export const WelcomeStrip = (props: WelcomeStripProps) => {
  const isAuthenticated = props.sessionUser !== null;

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
                  Bu site Eser Özvataf tarafından{"  "}
                  <span class="highlight">
                    eser.live
                  </span>{" "}
                  ismi altında üretilen içeriklerin paylaşıldığı bir platform
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

type PlaylistCardProps = {
  id: string;
  title: string;
  description: string;
};

export const PlaylistCard = (props: PlaylistCardProps) => {
  return (
    <a
      href={`https://www.youtube.com/playlist?list=${props.id}`}
      class="no-underline basis-[32%] flex"
    >
      <div class="card card-compact glass w-full h-full bg-base-300 text-base-content hover:bg-neutral hover:text-neutral-content">
        <div class="card-body">
          <h3 class="card-title m-0">{props.title}</h3>
          <p class="m-0">{props.description}</p>
        </div>
      </div>
    </a>
  );
};

export const Playlists = () => {
  return (
    <div class="content-area">
      <h2>Playlistler</h2>
      <div class="flex flex-row flex-wrap gap-4">
        <PlaylistCard
          id="PLWLiJPAYmgZAS3xwyNPEGPXZ9rE1ABJzZ"
          title="Yazılımcı Haberleri"
          description="Her pazartesi YouTube’da gerçekleştirdiğimiz canlı yayınlarda haftanın öne çıkan haberleri hakkında konuşuyoruz. Bekleriz."
        />
        <PlaylistCard
          id="PLWLiJPAYmgZBKNq3AEH3yR4EPOa2CJYK5"
          title="JavaScript"
          description="JavaScript ekosistemini frameworkleri, standartları ve araçlarıyla full-stack olarak incelediğimiz ve irdelediğimiz yayınlar."
        />
        <PlaylistCard
          id="PLWLiJPAYmgZBLJaOFdjv1cyry82fzvTSA"
          title="Geliştirme Pratikleri"
          description="Günlük olarak kullandığımız teknoloji ve araçların pek bilinmeyen özelliklerini veya best-practiselerini konuştuğumuz yayınlar."
        />
      </div>
    </div>
  );
};

interface EventsProps {
  /** Whether the user is logged-in */
  isLoggedIn: boolean;
  /** Whether the user is an editor */
  isEditor: boolean;
}

export const Events = (props: EventsProps) => {
  const endpoint = "/events/upcoming/";

  return (
    <div class="content-area mt-12">
      <h2>Planlı Etkinlik Takvimi</h2>

      <EventsList
        endpoint={endpoint}
        isLoggedIn={props.isLoggedIn}
        isEditor={props.isEditor}
      />
    </div>
  );
};

export default defineRoute<State>((_req, ctx) => {
  const isLoggedIn = ctx.state.sessionUser !== null;
  const isEditor = ctx.state.isEditor;

  return (
    <>
      <Head href={ctx.url.href} />
      <main>
        <WelcomeStrip sessionUser={ctx.state.sessionUser} />

        <Playlists />
        <Events isLoggedIn={isLoggedIn} isEditor={isEditor} />
      </main>
    </>
  );
});

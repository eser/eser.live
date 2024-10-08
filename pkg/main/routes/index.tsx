// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { Handlers, PageProps } from "$fresh/server.ts";
import { eventRepository } from "@/pkg/main/data/event/repository.ts";
import type { EventWithStats } from "@/pkg/main/data/event/types.ts";
import type { User } from "@/pkg/main/data/user/types.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { ensureMediaTypes, type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { EventsList } from "./(common)/(_components)/event-list.tsx";

type HandlerResult = {
  payload: {
    events: Awaited<ReturnType<typeof eventRepository.findAllWithStats>>;
  };
};

const EVENTS_PAGE_SIZE = 10;

export const handler: Handlers<HandlerResult, State> = {
  async GET(req, ctx) {
    const mediaTypes = ensureMediaTypes(req, ["application/json", "text/html"]);

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const eventsCursor = getCursor(req.url, EVENTS_PAGE_SIZE);
    const events = await eventRepository.findAllWithStats(eventsCursor, twoHoursAgo, ctx.state.sessionUser?.id ?? null);

    const result: HandlerResult = {
      payload: {
        events,
      },
    };

    if (mediaTypes.includes("application/json")) {
      return Response.json(result.payload);
    }

    return ctx.render(result);
  },
};

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
            <h1>Merhaba {isAuthenticated ? props.sessionUser!.name : "oradaki"} 👋🏻</h1>

            <p>
              <span class="highlight">eser.live</span>{" "}
              ismiyle içerik ve proje geliştirmeye yönelik bir platform oluşturduk. Geçmişte{" "}
              <a href="https://acikkaynak.github.io/">Açık Kaynak İnisiyatifi</a>
              nde edindiğimiz bilgi birikimini artık yeni nesil medya mecralarına taşıyoruz. Sen de{" "}
              <span class="highlight">GitHub</span>{" "}
              hesabınla giriş yapabilir, ve site üzerinden katılım gerçekleştirebilirsin.
            </p>
            <p>
              Topluluk için <a href="https://discord.eser.live/">Discord'da</a>, anlık yayın ve etkinlik duyuruları için
              {" "}
              <a href="https://t.me/eserlive">Telegram kanalımızda</a> ve{" "}
              <a href="https://x.com/eserozvataf">Twitter hesabımızda</a>, direkt yayınlar ve yayın bildirimleri içinse
              {" "}
              <a href="https://youtube.com/@eserlive">YouTube kanalımızda</a> bize katılabilirsin.
            </p>
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
    <a href={`https://www.youtube.com/playlist?list=${props.id}`} class="no-underline">
      <div class="card card-compact glass bg-base-300 text-base-content hover:bg-neutral hover:text-neutral-content">
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
    <div>
      <h2>Playlistler</h2>
      <div class="grid grid-flow-row grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
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
  items: EventWithStats[];
}

export const Events = (props: EventsProps) => {
  return (
    <div class="mt-12">
      <h2>Planlı Etkinlik Takvimi</h2>

      <EventsList items={props.items} />
    </div>
  );
};

export default function (props: PageProps<HandlerResult, State>) {
  return (
    <>
      <Head href={props.url.href} />
      <main>
        <WelcomeStrip sessionUser={props.state.sessionUser} />

        <div class="content-area flex gap-4">
          <div>
            <Playlists />
            <Events items={props.data.payload.events.items} />
          </div>
          <div class="hidden md:block">
            <iframe
              src="https://discord.com/widget?id=1139067412105396304"
              width="350"
              height="500"
              allowTransparency={true}
              frameborder="0"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            >
            </iframe>
          </div>
        </div>
      </main>
    </>
  );
}

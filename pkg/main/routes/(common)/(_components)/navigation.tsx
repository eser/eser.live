import { type Handlers, type PageProps } from "$fresh/server.ts";
import { accepts } from "@std/http/negotiation";
import { InvalidContentTypeError } from "@/pkg/main/library/http/invalid-content-type.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { VideosList } from "@/pkg/main/routes/(common)/(_islands)/videos-list.tsx";
import { videoRepository } from "@/pkg/main/data/video/repository.ts";
import { type State } from "@/pkg/main/plugins/session.ts";

type HandlerResult = Awaited<ReturnType<typeof videoRepository.findAll>>;

export const handler: Handlers<HandlerResult, State> = {
  async GET(req, ctx) {
    const mediaTypes = accepts(req);

    const result = await videoRepository.findAll();

    if (mediaTypes.includes("application/json")) {
      return Response.json(result);
    }

    if (mediaTypes.includes("text/html")) {
      return ctx.render(result);
    }

    throw new InvalidContentTypeError(["application/json", "text/html"]);
  },
};

export default function (props: PageProps<HandlerResult>) {
  return (
    <>
      <Head title="Videolar" href={props.url.href} />
      <main>
        <div class="content-area">
          <h1>Videolar</h1>
          <VideosList
            initialVideos={props.data.items}
            initialNextPageToken={props.data.nextPageToken}
          />
        </div>
      </main>
    </>
  );
}

export function Navigation() {
  return (
    <nav>
      {/* ... existing navigation items ... */}
      <a href="/videos">Videolar</a>
      {/* ... */}
    </nav>
  );
}

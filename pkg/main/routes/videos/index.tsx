// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { Handlers, PageProps } from "$fresh/server.ts";
import { videoRepository } from "@/pkg/main/data/video/repository.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { ensureMediaTypes, type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { VideoList } from "./(_islands)/list.tsx";

type HandlerResult = {
  payload: Awaited<ReturnType<typeof videoRepository.findAll>>;
};

const PAGE_SIZE = 20;

export const handler: Handlers<HandlerResult, State> = {
  async GET(req, ctx) {
    const mediaTypes = ensureMediaTypes(req, ["application/json", "text/html"]);

    const cursor = getCursor(req.url, PAGE_SIZE);
    const videos = await videoRepository.findAll(cursor);

    const result: HandlerResult = {
      payload: videos,
    };

    if (mediaTypes.includes("application/json")) {
      return Response.json(result.payload);
    }

    return ctx.render(result);
  },
};

export default function (props: PageProps<HandlerResult, State>) {
  return (
    <>
      <Head title="Videolar" href={props.url.href} />
      <main>
        <div class="content-area">
          <h1>Videolar</h1>
          <VideoList
            initialItems={props.data.payload.items}
            initialNextCursor={props.data.payload.nextCursor}
            baseUri={props.url.href}
          />
        </div>
      </main>
    </>
  );
}

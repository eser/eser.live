// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { Handlers, PageProps } from "$fresh/server.ts";
import { storyRepository } from "@/pkg/main/data/story/repository.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { ensureMediaTypes, type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { StoryList } from "./(_islands)/list.tsx";

type HandlerResult = {
  payload: Awaited<ReturnType<typeof storyRepository.findAllByKindAndStatusWithDetails>>;
};

const PAGE_SIZE = 20;

export const handler: Handlers<HandlerResult, State> = {
  async GET(req, ctx) {
    const mediaTypes = ensureMediaTypes(req, ["application/json", "text/html"]);

    const cursor = getCursor(req.url, PAGE_SIZE);
    const articles = await storyRepository.findAllByKindAndStatusWithDetails("article", "published", cursor);

    const result: HandlerResult = {
      payload: articles,
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
      <Head title="Makaleler" href={props.url.href} />
      <main>
        <div class="content-area">
          <h1>Makaleler</h1>
          <StoryList
            initialItems={props.data.payload.items}
            initialNextCursor={props.data.payload.nextCursor}
            baseUri={props.url.href}
          />
        </div>
      </main>
    </>
  );
}

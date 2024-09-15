// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { Handlers, PageProps } from "$fresh/server.ts";
import { accepts } from "@std/http/negotiation";
import { storyRepository } from "@/pkg/main/data/story/repository.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { InvalidContentTypeError } from "@/pkg/main/library/http/invalid-content-type.ts";
import type { State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { StoryList } from "./(_islands)/list.tsx";

type HandlerResult = {
  payload: Awaited<ReturnType<typeof storyRepository.findAllByKindAndStatusWithDetails>>;
};

const PAGE_SIZE = 20;

export const handler: Handlers<HandlerResult, State> = {
  async GET(req, ctx) {
    const mediaTypes = accepts(req);

    const cursor = getCursor(req.url, PAGE_SIZE);
    const stories = await storyRepository.findAllByKindAndStatusWithDetails("article", "published", cursor);

    const result: HandlerResult = {
      payload: stories,
    };

    if (mediaTypes.includes("application/json")) {
      return Response.json(result.payload);
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
      <Head title="Yazılar" href={props.url.href} />
      <main>
        <div class="content-area">
          <h1>Yazılar</h1>
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

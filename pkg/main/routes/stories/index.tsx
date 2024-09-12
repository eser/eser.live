// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Handlers, type PageProps } from "$fresh/server.ts";
import { accepts } from "@std/http/negotiation";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { InvalidContentTypeError } from "@/pkg/main/library/http/invalid-content-type.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { StoriesList } from "@/pkg/main/routes/(common)/(_islands)/stories-list.tsx";
import { storyRepository } from "@/pkg/main/data/story/repository.ts";
import { type State } from "@/pkg/main/plugins/session.ts";

type HandlerResult = Awaited<
  ReturnType<typeof storyRepository.findAllByKindAndStatusWithDetails>
>;

const PAGE_SIZE = 10;

export const handler: Handlers<HandlerResult, State> = {
  async GET(req, ctx) {
    const mediaTypes = accepts(req);

    const cursor = getCursor(req.url, PAGE_SIZE);
    const result = await storyRepository.findAllByKindAndStatusWithDetails(
      "article",
      "published",
      cursor,
    );

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
      <Head title="Yazılar" href={props.url.href} />
      <main>
        <div class="content-area">
          <h1>Yazılar</h1>
          <StoriesList
            initialStories={props.data.items}
            initialNextCursor={props.data.nextCursor}
          />
        </div>
      </main>
    </>
  );
}

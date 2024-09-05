// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { defineRoute } from "$fresh/server.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { storyRepository } from "@/pkg/main/data/repositories/stories.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { StoriesList } from "@/pkg/main/routes/(common)/(_islands)/stories-list.tsx";

export default defineRoute<State>(async (req, ctx) => {
  const cursor = getCursor(req.url, 15);
  const result = await storyRepository.findAllByKindAndStatus("article", "published", cursor);

  return (
    <>
      <Head title="Yazılar" href={ctx.url.href} />
      <main>
        <div class="content-area">
          <h1>Yazılar</h1>
          <StoriesList
            initialStories={result.items}
            initialNextCursor={result.cursor}
          />
        </div>
      </main>
    </>
  );
});

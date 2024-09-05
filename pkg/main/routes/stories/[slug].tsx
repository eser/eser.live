// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { defineRoute } from "$fresh/server.ts";
import { CSS, render } from "@deno/gfm";
import { type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { Share } from "@/pkg/main/routes/(common)/(_islands)/share.tsx";
import { SITE_LOCALE } from "@/pkg/main/constants.ts";
import { storyRepository } from "@/pkg/main/data/repositories/stories.ts";

export default defineRoute<State>(async (_req, ctx) => {
  const story = await storyRepository.findBySlug(ctx.params.slug);

  if (story === undefined) {
    return await ctx.renderNotFound();
  }

  return (
    <>
      <Head title={`Yazı: ${story.title}`} href={ctx.url.href}>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <main>
        <div class="content-area">
          <h1>{story.title}</h1>
          {story.publishedAt !== null && (
            <time
              dateTime={story.publishedAt.toISOString()}
              class="text-slate-500"
            >
              {story.publishedAt.toLocaleDateString(SITE_LOCALE, {
                dateStyle: "long",
              })}
            </time>
          )}
          <Share url={ctx.url.href} title={story.title} />
          <div
            class="mt-8 markdown-body !bg-transparent !dark:text-white"
            data-color-mode="auto"
            data-light-theme="light"
            data-dark-theme="dark"
            dangerouslySetInnerHTML={{ __html: render(story.content) }}
          />
        </div>
      </main>
    </>
  );
});

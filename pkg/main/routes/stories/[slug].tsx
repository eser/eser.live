// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { defineRoute } from "$fresh/server.ts";
import { SITE_LOCALE } from "@/pkg/main/constants.ts";
import { storyRepository } from "@/pkg/main/data/story/repository.ts";
import { readingTime } from "@/pkg/main/library/display/reading-time.ts";
import type { State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { Share } from "@/pkg/main/routes/(common)/(_islands)/share.tsx";
import { CSS, render } from "@deno/gfm";

export default defineRoute<State>(async (_req, ctx) => {
  const story = await storyRepository.findBySlug(ctx.params.slug);

  if (story === null) {
    return await ctx.renderNotFound();
  }

  return (
    <>
      <Head title={`Yazı: ${story.title}`} href={ctx.url.href}>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <main class="container mx-auto px-4 py-8">
        <div class="content-area max-w-3xl mx-auto">
          <h1 class="text-3xl font-bold mb-4">{story.title}</h1>
          <div class="text-slate-500 mb-4 flex">
            {story.publishedAt !== null && (
              <>
                <time dateTime={story.publishedAt.toISOString()}>
                  {story.publishedAt.toLocaleDateString(SITE_LOCALE, {
                    dateStyle: "long",
                  })}
                </time>
                <span class="mx-2">•</span>
              </>
            )}
            <span>{(readingTime(story.content) / 60).toFixed(2)} dakika okuma süresi</span>
          </div>
          <Share url={ctx.url.href} title={story.title} content={story.content} publishedAt={story.publishedAt} />
          <div
            class="mt-8 markdown-body !bg-transparent !dark:text-white prose prose-lg max-w-none"
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

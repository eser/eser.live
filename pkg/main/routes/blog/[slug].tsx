// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { defineRoute } from "$fresh/server.ts";
import { CSS, render } from "$gfm";
import { type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { Share } from "@/pkg/main/routes/(common)/(_islands)/share.tsx";
import { SITE_LOCALE } from "@/pkg/main/constants.ts";
import { getPost } from "@/pkg/main/services/posts.ts";

export default defineRoute<State>(async (_req, ctx) => {
  const post = await getPost(ctx.params.slug);

  if (post === null) {
    return await ctx.renderNotFound();
  }

  return (
    <>
      <Head title={`Blog: ${post.title}`} href={ctx.url.href}>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <main>
        <div class="content-area">
          <h1>{post.title}</h1>
          {post.publishedAt.toString() !== "Invalid Date" && (
            <time
              dateTime={post.publishedAt.toISOString()}
              class="text-slate-500"
            >
              {post.publishedAt.toLocaleDateString(SITE_LOCALE, {
                dateStyle: "long",
              })}
            </time>
          )}
          <Share url={ctx.url.href} title={post.title} />
          <div
            class="mt-8 markdown-body !bg-transparent !dark:text-white"
            data-color-mode="auto"
            data-light-theme="light"
            data-dark-theme="dark"
            dangerouslySetInnerHTML={{ __html: render(post.content) }}
          />
        </div>
      </main>
    </>
  );
});

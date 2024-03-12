// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { defineRoute } from "$fresh/server.ts";
import { SITE_LOCALE } from "@/utils/constants.ts";
import { getPosts, type Post } from "@/utils/posts.ts";
import Head from "@/components/head.tsx";
import { HEADING_WITH_MARGIN_STYLES } from "@/utils/constants.ts";

function PostCard(props: Post) {
  return (
    <div class="py-8">
      <a class="sm:col-span-2" href={`/blog/${props.slug}`}>
        <h2 class="text-2xl font-bold">
          {props.title}
        </h2>
        {props.publishedAt.toString() !== "Invalid Date" && (
          <time
            dateTime={props.publishedAt.toISOString()}
            class="text-slate-500"
          >
            {props.publishedAt.toLocaleDateString(SITE_LOCALE, {
              dateStyle: "long",
            })}
          </time>
        )}
        {
          /* <div class="mt-4">
          {props.summary}
        </div> */
        }
      </a>
    </div>
  );
}

export default defineRoute(async (_req, ctx) => {
  const posts = await getPosts();

  return (
    <>
      <Head title="Blog Yazıları" href={ctx.url.href} />
      <main class="p-4 flex-1">
        <h1 class={HEADING_WITH_MARGIN_STYLES}>Blog Yazıları</h1>
        <div class="divide-y">
          {posts.map((post) => <PostCard {...post} />)}
        </div>
      </main>
    </>
  );
});

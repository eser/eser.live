// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { defineRoute } from "$fresh/server.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/components/head.tsx";
import { SITE_LOCALE } from "@/pkg/main/utils/constants.ts";
import { getPosts, type Post } from "@/pkg/main/utils/posts.ts";

function PostCard(props: Post) {
  return (
    <div class="py-8">
      <a class="sm:col-span-2" href={`/blog/${props.slug}`}>
        <h2>
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

export default defineRoute<State>(async (_req, ctx) => {
  const posts = await getPosts();

  return (
    <>
      <Head title="Blog Yazıları" href={ctx.url.href} />
      <main>
        <div>
          <h1>Blog Yazıları</h1>
          <div class="divide-y">
            {posts.map((post) => <PostCard {...post} />)}
          </div>
        </div>
      </main>
    </>
  );
});

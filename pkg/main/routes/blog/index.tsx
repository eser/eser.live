// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { defineRoute } from "$fresh/server.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { SITE_LOCALE } from "@/pkg/main/constants.ts";
import { getPosts, type Post } from "@/pkg/main/services/posts.ts";

function PostCard(props: Post) {
  return (
    <div class="group card card-compact">
      <a class="no-underline" href={`/blog/${props.slug}`}>
        <div class="card-body">
          <h2 class="card-title group-hover:underline underline-offset-2">
            {props.title}
          </h2>
          {props.publishedAt.toString() !== "Invalid Date" && (
            <div class="card-actions">
              <time
                dateTime={props.publishedAt.toISOString()}
                class="text-slate-500"
              >
                {props.publishedAt.toLocaleDateString(SITE_LOCALE, {
                  dateStyle: "long",
                })}
              </time>
            </div>
          )}
          {
            /* <div class="mt-4">
            {props.summary}
          </div> */
          }
        </div>
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
        <div class="content-area">
          <h1>Blog Yazıları</h1>
          <div class="divide-y">
            {posts.map((post) => <PostCard {...post} />)}
          </div>
        </div>
      </main>
    </>
  );
});

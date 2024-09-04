// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { defineRoute } from "$fresh/server.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { SITE_LOCALE } from "@/pkg/main/constants.ts";
import { getPosts, type Post } from "@/pkg/main/services/posts.ts";
import SearchForm from "@/pkg/main/islands/SearchForm.tsx";
import { asciify } from "@/pkg/main/utils/stringUtils.ts";

const highlightSearchTerm = (text: string | undefined, searchTerm: string) => {
  if (!text || !searchTerm) return text || "";
  const asciifiedText = asciify(text);
  const asciifiedSearchTerm = asciify(searchTerm);

  const regex = new RegExp(`(${asciifiedSearchTerm})`, "gi");
  let lastIndex = 0;
  const result: string[] = [];

  asciifiedText.replace(regex, (match, p1, offset) => {
    result.push(text.slice(lastIndex, offset));
    result.push(`<mark>${text.slice(offset, offset + match.length)}</mark>`);
    lastIndex = offset + match.length;
    return match;
  });

  result.push(text.slice(lastIndex));

  return result.join("");
};

const PostCard = (props: Post & { searchTerm?: string }) => {
  return (
    <div class="group card card-compact">
      <a class="no-underline" href={`/blog/${props.slug}`}>
        <div class="card-body">
          <h2
            class="card-title group-hover:underline underline-offset-2"
            dangerouslySetInnerHTML={{
              __html: highlightSearchTerm(props.title, props.searchTerm || ""),
            }}
          />
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
          {props.searchTerm && props.summary && (
            <div
              class="mt-4"
              dangerouslySetInnerHTML={{
                __html: highlightSearchTerm(props.summary, props.searchTerm),
              }}
            />
          )}
        </div>
      </a>
    </div>
  );
};

const Pagination = (
  { currentPage, totalPages, searchTerm }: {
    currentPage: number;
    totalPages: number;
    searchTerm: string;
  },
) => {
  return (
    <div class="join flex justify-center mt-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <a
          href={`/blog?page=${page}${
            searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
          }`}
          class={`join-item btn ${page === currentPage ? "btn-active" : ""}`}
        >
          {page}
        </a>
      ))}
    </div>
  );
};

export default defineRoute<State>(async (req, ctx) => {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const searchTerm = url.searchParams.get("search") || "";

  const { posts, totalPages } = await getPosts(page, 10, searchTerm);

  return (
    <>
      <Head title="Blog Yazıları" href={ctx.url.href} />
      <main>
        <div class="content-area">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold">Blog Yazıları</h1>
            <SearchForm initialSearchTerm={searchTerm} />
          </div>
          <div className="divide-y">
            {posts.map((post) => (
              <PostCard key={post.slug} {...post} searchTerm={searchTerm} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            searchTerm={searchTerm}
          />
        </div>
      </main>
    </>
  );
});

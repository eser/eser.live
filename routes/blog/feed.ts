// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { Feed } from "feed";
import { getPosts } from "@/utils/posts.ts";
import { SITE_DESCRIPTION, SITE_LANG, SITE_NAME } from "@/utils/constants.ts";
import { defineRoute } from "$fresh/server.ts";

const copyright = `Copyright ${new Date().getFullYear()} ${SITE_NAME}`;

// Use https://validator.w3.org/feed/ to validate RSS feed syntax.
export default defineRoute(async (_req, ctx) => {
  const { origin } = ctx.url;
  const feed = new Feed({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    id: `${origin}/blog`,
    link: `${origin}/blog`,
    language: SITE_LANG,
    favicon: `${origin}/favicon.ico`,
    copyright,
    generator: "cool",
    feedLinks: {
      atom: `${origin}/blog/feed`,
    },
  });

  const posts = await getPosts();
  for (const post of posts) {
    feed.addItem({
      id: `${origin}/blog/${post.slug}`,
      title: post.title,
      description: post.summary,
      date: post.publishedAt,
      link: `${origin}/blog/${post.slug}`,
      // author: [{ name: "The Deno Authors" }],
      // copyright,
      published: new Date(post.publishedAt),
    });
  }

  const atomFeed = feed.atom1();
  return new Response(atomFeed, {
    headers: {
      "content-type": "application/atom+xml; charset=utf-8",
    },
  });
});

// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { defineRoute } from "$fresh/server.ts";
import { SITE_DESCRIPTION, SITE_LANG, SITE_NAME } from "@/pkg/main/constants.ts";
import { storyRepository } from "@/pkg/main/data/story/repository.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import type { State } from "@/pkg/main/plugins/session.ts";
import { Feed } from "feed";

const copyright = `Copyright ${new Date().getFullYear()} ${SITE_NAME}`;

// Use https://validator.w3.org/feed/ to validate RSS feed syntax.
export default defineRoute<State>(async (req, ctx) => {
  const { origin } = ctx.url;
  const feed = new Feed({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    id: `${origin}/news`,
    link: `${origin}/news`,
    language: SITE_LANG,
    favicon: `${origin}/favicon.ico`,
    copyright,
    generator: "cool",
    feedLinks: {
      atom: `${origin}/news/feed`,
    },
  });

  const cursor = getCursor(req.url, 10);
  const result = await storyRepository.findAllByKindAndStatus("news", "published", cursor);
  for (const story of result.items) {
    feed.addItem({
      id: `${origin}/news/${story.slug}`,
      title: story.title,
      description: story.description,
      date: story.publishedAt ?? new Date(),
      link: `${origin}/news/${story.slug}`,
      // author: [{ name: "The Deno Authors" }],
      // copyright,
      published: story.publishedAt !== null ? new Date(story.publishedAt) : undefined,
    });
  }

  const atomFeed = feed.atom1();
  return new Response(atomFeed, {
    headers: {
      "content-type": "application/atom+xml; charset=utf-8",
    },
  });
});

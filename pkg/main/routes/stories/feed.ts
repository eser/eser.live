// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { Feed } from "feed";
import {
  SITE_DESCRIPTION,
  SITE_LANG,
  SITE_NAME,
} from "@/pkg/main/constants.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import { defineRoute } from "$fresh/server.ts";
import { storyRepository } from "@/pkg/main/data/repositories/stories.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";

const copyright = `Copyright ${new Date().getFullYear()} ${SITE_NAME}`;

// Use https://validator.w3.org/feed/ to validate RSS feed syntax.
export default defineRoute<State>(async (req, ctx) => {
  const { origin } = ctx.url;
  const feed = new Feed({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    id: `${origin}/stories`,
    link: `${origin}/stories`,
    language: SITE_LANG,
    favicon: `${origin}/favicon.ico`,
    copyright,
    generator: "cool",
    feedLinks: {
      atom: `${origin}/stories/feed`,
    },
  });

  const cursor = getCursor(req.url, 10);
  const result = await storyRepository.findAllByKindAndStatus("article", "published", cursor);
  for (const story of result.items) {
    feed.addItem({
      id: `${origin}/stories/${story.slug}`,
      title: story.title,
      description: story.description,
      date: story.publishedAt ?? new Date(),
      link: `${origin}/stories/${story.slug}`,
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

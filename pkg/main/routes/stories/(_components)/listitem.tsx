// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { SITE_LOCALE } from "@/pkg/main/constants.ts";
import type { StoryWithDetails } from "@/pkg/main/data/story/types.ts";

export type StoryListItemProps = {
  story: StoryWithDetails;
};

export function StoryListItem(props: StoryListItemProps) {
  return (
    <a
      href={`/stories/${props.story.slug}`}
      class="no-underline flex items-center border-0 border-b border-neutral border-solid"
    >
      <div class="w-1/6 text-primary-content">
        {new Date(props.story.publishedAt).toLocaleDateString(SITE_LOCALE, {
          dateStyle: "medium",
        })}
      </div>
      <div class="flex-1">
        <h2 class="text-xl font-bold no-underline hover:underline">{props.story.title}</h2>
      </div>
    </a>
  );
}

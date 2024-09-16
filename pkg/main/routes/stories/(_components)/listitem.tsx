// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { formatDateTime } from "@/pkg/main/library/display/format-datetime.ts";
import type { StoryWithDetails } from "@/pkg/main/data/story/types.ts";

type DateProps = {
  date: Date | null;
};

function Date(props: DateProps) {
  if (props.date === null) {
    return <>{"-"}</>;
  }

  const [day, month, year, _] = formatDateTime(props.date);

  return (
    <time datetime={props.date.toISOString()}>
      {`${day} ${month}`}
      <br class="md:hidden" />
      <span class="hidden md:inline">{" "}</span>
      {`${year}`}
    </time>
  );
}

export type StoryListItemProps = {
  story: StoryWithDetails;
};

export function StoryListItem(props: StoryListItemProps) {
  return (
    <a
      href={`/stories/${props.story.slug}`}
      class="no-underline flex items-center border-0 border-b border-neutral border-solid gap-2"
    >
      <div class="w-1/5 text-primary-content text-center md:text-left">
        <Date date={props.story.publishedAt} />
      </div>
      <div class="flex-1">
        <h2 class="text-xl font-bold no-underline hover:underline">{props.story.title}</h2>
      </div>
    </a>
  );
}

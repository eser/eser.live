// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { SITE_LOCALE } from "@/pkg/main/constants.ts";
import type { YouTubeVideo } from "@/pkg/main/services/youtube.ts";

export type VideoListItemProps = {
  video: YouTubeVideo;
};

export function VideoListItem(props: VideoListItemProps) {
  return (
    <div class="mb-8 flex flex-col sm:flex-row items-center border-0 border-b border-neutral border-solid sm:border-b-0">
      <a
        href={`https://www.youtube.com/watch?v=${props.video.id}`}
        target="_blank"
        rel="noopener noreferrer"
        class="mr-4"
      >
        <img src={props.video.thumbnailUrl} alt={props.video.title} class="w-full aspect-video object-cover" />
      </a>
      <div class="flex-1">
        <a
          href={`https://www.youtube.com/watch?v=${props.video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          class="no-underline hover:underline"
        >
          <h2 class="text-xl font-bold" dangerouslySetInnerHTML={{ __html: props.video.title }}></h2>
        </a>
        <p class="text-primary-content">{props.video.description}</p>
        <p class="text-sm text-primary-content mt-1">
          Yayın Tarihi: {new Date(props.video.publishedAt).toLocaleDateString(SITE_LOCALE, {
            dateStyle: "long",
          })}
        </p>
      </div>
    </div>
  );
}

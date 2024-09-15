// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { InfiniteScrollerList } from "@/pkg/main/routes/(common)/(_islands)/infinite-scroller-list.tsx";
import { VideoListItem } from "../(_components)/listitem.tsx";

type VideoListProps<TItem, TCursor> = {
  initialItems: TItem[];
  initialNextCursor: TCursor | null;
  baseUri: string;
};

export function VideoList<TItem, TCursor>(props: VideoListProps<TItem, TCursor>) {
  return (
    <InfiniteScrollerList
      initialItems={props.initialItems}
      initialNextCursor={props.initialNextCursor}
      baseUri={props.baseUri}
      itemRenderer={(item) => <VideoListItem key={item.id} video={item} />}
    />
  );
}

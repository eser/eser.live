// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { InfiniteScrollerList } from "@/pkg/main/routes/(common)/(_islands)/infinite-scroller-list.tsx";
import { StoryListItem } from "../(_components)/listitem.tsx";

type StoryListProps<TItem, TCursor> = {
  initialItems: TItem[];
  initialNextCursor: TCursor | null;
  baseUri: string;
};

export function StoryList<TItem, TCursor>(props: StoryListProps<TItem, TCursor>) {
  return (
    <InfiniteScrollerList
      initialItems={props.initialItems}
      initialNextCursor={props.initialNextCursor}
      baseUri={props.baseUri}
      itemRenderer={(item) => <StoryListItem key={item.id} story={item} />}
    />
  );
}

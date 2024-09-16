// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { InfiniteScrollerList } from "@/pkg/main/routes/(common)/(_islands)/infinite-scroller-list.tsx";
import { ProjectListItem } from "../(_components)/listitem.tsx";

type ProjectListProps<TItem, TCursor> = {
  initialItems: TItem[];
  initialNextCursor: TCursor | null;
  baseUri: string;
};

export function ProjectList<TItem, TCursor>(props: ProjectListProps<TItem, TCursor>) {
  return (
    <InfiniteScrollerList
      initialItems={props.initialItems}
      initialNextCursor={props.initialNextCursor}
      baseUri={props.baseUri}
      itemRenderer={(item) => <ProjectListItem key={item.id} project={item} />}
    />
  );
}

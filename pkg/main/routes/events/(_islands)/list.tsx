// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { EventWithStats } from "@/pkg/main/data/event/types.ts";
import { EventListItem } from "../(_components)/listitem.tsx";

type EventListProps = {
  initialItems: EventWithStats[];
  initialNextCursor: string | null;
  baseUri: string;
};

export function EventList(props: EventListProps) {
  const items = useSignal(props.initialItems);
  const nextCursor = useSignal(props.initialNextCursor);
  const isLoading = useSignal(false);

  useEffect(() => {
    items.value = props.initialItems;
    nextCursor.value = props.initialNextCursor;
  }, [props.initialItems, props.initialNextCursor]);

  const loadMore = async () => {
    if (isLoading.value || !nextCursor.value) {
      return;
    }

    isLoading.value = true;

    try {
      const response = await fetch(`${props.baseUri}?cursor=${nextCursor.value}`);
      const data = await response.json();

      items.value = [...items.value, ...data.items];
      nextCursor.value = data.nextCursor;
    } finally {
      isLoading.value = false;
    }
  };

  return (
    <div class="space-y-4">
      {items.value.map((event) => <EventListItem key={event.id} event={event} />)}
      {nextCursor.value && (
        <button
          class="btn btn-primary"
          onClick={loadMore}
          disabled={isLoading.value}
        >
          {isLoading.value ? "Yükleniyor..." : "Daha Fazla Yükle"}
        </button>
      )}
    </div>
  );
}

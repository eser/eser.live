// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { JSX } from "preact";

type InfiniteScrollerListProps<TItem, TCursor> = {
  initialItems: TItem[];
  initialNextCursor: TCursor | null;
  baseUri: string;
  itemRenderer: (item: TItem) => JSX.Element;
};

export function InfiniteScrollerList<TItem, TCursor>(props: InfiniteScrollerListProps<TItem, TCursor>) {
  const items = useSignal(props.initialItems);
  const nextCursor = useSignal(props.initialNextCursor);
  const loading = useSignal(false);

  const hasMore = useComputed(() => nextCursor.value !== null);

  const loadMoreItems = async () => {
    loading.value = true;
    const url = new URL(props.baseUri, globalThis.location.href);
    url.searchParams.set("cursor", String(nextCursor.value!));

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        credentials: "include",
        headers: {
          accept: "application/json",
        },
      });
      const data = await response.json();
      items.value = [...items.value, ...data.items];
      nextCursor.value = data.nextCursor;
    } catch (error) {
      console.error("Error loading more items:", error);
    } finally {
      loading.value = false;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        globalThis.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500 &&
        !loading.value &&
        hasMore.value
      ) {
        loadMoreItems();
      }
    };

    globalThis.addEventListener("scroll", handleScroll);
    return () => globalThis.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {items.value.map((item) => props.itemRenderer(item))}
      {loading.value && (
        <div class="text-center py-4">
          <div class="loading loading-spinner loading-lg"></div>
        </div>
      )}
      {!loading.value && !hasMore.value && items.value.length > 0 && (
        <div class="card">
          <div class="card-body items-center text-center">
            <p class="text-lg">~~ EOF ~~</p>
          </div>
        </div>
      )}
    </>
  );
}

import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Profile } from "@/pkg/main/data/profile/types.ts";
import { ProfileListItem } from "../(_components)/listitem.tsx";

type ProfileListProps = {
  initialItems: Profile[];
  initialNextCursor: string | null;
  baseUri: string;
};

export function ProfileList(props: ProfileListProps) {
  const items = useSignal(props.initialItems);
  const nextCursor = useSignal(props.initialNextCursor);
  const isLoading = useSignal(false);

  const loadMore = async () => {
    if (isLoading.value || !nextCursor.value) return;

    isLoading.value = true;
    const url = new URL(props.baseUri);
    url.searchParams.set("cursor", nextCursor.value);

    try {
      const response = await fetch(url.toString());
      const data = await response.json();

      items.value = [...items.value, ...data.items];
      nextCursor.value = data.nextCursor;
    } catch (error) {
      console.error("Error loading more profiles:", error);
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        globalThis.innerHeight + globalThis.scrollY >= document.body.offsetHeight - 100 &&
        !isLoading.value &&
        nextCursor.value
      ) {
        loadMore();
      }
    };

    globalThis.addEventListener("scroll", handleScroll);
    return () => globalThis.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div class="space-y-4">
      {items.value.map((profile) => <ProfileListItem key={profile.id} profile={profile} />)}
      {nextCursor.value && (
        <button
          class="btn btn-primary"
          onClick={loadMore}
          disabled={isLoading.value}
        >
          {isLoading.value ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}

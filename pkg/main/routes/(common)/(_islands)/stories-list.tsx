import { useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { type StoryWithDetails } from "@/pkg/main/data/story/types.ts";
import { StoryCard } from "@/pkg/main/routes/(common)/(_components)/story-card.tsx";

interface StoriesListProps {
  initialStories: Array<StoryWithDetails>;
  initialNextCursor: number | null;
}

export function StoriesList(
  { initialStories, initialNextCursor }: StoriesListProps,
) {
  const stories = useSignal(initialStories);
  const nextCursor = useSignal(initialNextCursor);
  const loading = useSignal(false);

  const hasMore = useComputed(() => nextCursor.value !== null);

  const loadMoreStories = async () => {
    if (loading.value || !hasMore.value) {
      return;
    }

    loading.value = true;
    const url = new URL("/stories/", globalThis.location.href);
    url.searchParams.set("cursor", String(nextCursor.value!));

    try {
      const response = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();
      console.log("data", data);
      stories.value = [...stories.value, ...data.items];
      nextCursor.value = data.nextCursor;
    } catch (error) {
      console.error("Error loading more stories:", error);
    } finally {
      loading.value = false;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        globalThis.innerHeight + globalThis.scrollY >=
          document.body.offsetHeight - 500
      ) {
        loadMoreStories();
      }
    };

    globalThis.addEventListener("scroll", handleScroll);
    return () => globalThis.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div class="divide-y">
      {stories.value.map((story) => <StoryCard key={story.id} item={story} />)}
      {loading.value && (
        <div class="text-center py-4">
          <div class="loading loading-spinner loading-lg"></div>
        </div>
      )}
      {!loading.value && !hasMore.value && stories.value.length > 0 && (
        <div class="card bg-base-200 p-6">
          <div class="card-body items-center text-center">
            <p class="text-lg">~~ EOF ~~</p>
          </div>
        </div>
      )}
    </div>
  );
}
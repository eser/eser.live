import { useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { type StoryWithDetails } from "@/pkg/main/data/story/types.ts";
import { SITE_LOCALE } from "@/pkg/main/constants.ts";

interface StoriesListProps {
  initialStories: Array<StoryWithDetails>;
  initialNextCursor: number | null;
}

function StoryItem({ story }: { story: StoryWithDetails }) {
  return (
    <div class="mb-8 flex">
      <a href={`/stories/${story.slug}`} class="w-1/3 mr-4 no-underline">
        {story.coverImageUrl ? (
          <img src={story.coverImageUrl} alt={story.title} class="w-full" />
        ) : (
          <div class="w-full h-full bg-neutral text-neutral-content flex items-center justify-center">
          </div>
        )}
      </a>
      <div class="flex-1">
        <a href={`/stories/${story.slug}`} class="no-underline hover:underline">
          <h2 class="text-xl font-bold">{story.title}</h2>
        </a>
        <p class="text-gray-600">{story.summary}</p>
        <p class="text-sm text-gray-500 mt-1">
          Yayın Tarihi:{" "}
          {new Date(story.publishedAt).toLocaleDateString(SITE_LOCALE, {
            dateStyle: "long",
          })}
        </p>
      </div>
    </div>
  );
}

export function StoriesList(
  { initialStories, initialNextCursor }: StoriesListProps,
) {
  const stories = useSignal(initialStories);
  const nextCursor = useSignal(initialNextCursor);
  const loading = useSignal(false);

  const hasMore = useComputed(() => nextCursor.value !== null);

  useEffect(() => {
    const handleScroll = () => {
      if (
        globalThis.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight &&
        !loading.value &&
        hasMore.value
      ) {
        loadMoreStories();
      }
    };

    globalThis.addEventListener("scroll", handleScroll);
    return () => globalThis.removeEventListener("scroll", handleScroll);
  }, []);

  const loadMoreStories = async () => {
    if (loading.value || !hasMore.value) return;

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
      stories.value = [...stories.value, ...data.items];
      nextCursor.value = data.nextCursor;
    } catch (error) {
      console.error("Error loading more stories:", error);
    } finally {
      loading.value = false;
    }
  };

  return (
    <div>
      {stories.value.map((story) => <StoryItem key={story.id} story={story} />)}
      {loading.value && <p>Loading more stories...</p>}
    </div>
  );
}

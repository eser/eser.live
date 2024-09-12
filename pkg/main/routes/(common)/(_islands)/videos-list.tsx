import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { SITE_LOCALE } from "@/pkg/main/constants.ts";
import { YouTubeVideo } from "@/pkg/main/services/youtube.ts";

interface VideosListProps {
  initialVideos: YouTubeVideo[];
  initialNextPageToken?: string;
}

function VideoItem({ video }: { video: YouTubeVideo }) {
  return (
    <div class="mb-8 flex">
      <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" class="w-1/3 mr-4">
        <img src={video.thumbnailUrl} alt={video.title} class="w-full" />
      </a>
      <div class="flex-1">
        <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" class="no-underline hover:underline">
          <h2 class="text-xl font-bold" dangerouslySetInnerHTML={{ __html: video.title }}></h2>
        </a>
        <p class="text-gray-600">{video.description}</p>
        <p class="text-sm text-gray-500 mt-1">
          Yayın Tarihi:{" "}
          {new Date(video.publishedAt).toLocaleDateString(SITE_LOCALE, {
            dateStyle: "long",
          })}
        </p>
      </div>
    </div>
  );
}

export function VideosList(
  { initialVideos, initialNextPageToken }: VideosListProps,
) {
  const videos = useSignal(initialVideos);
  const nextPageToken = useSignal(initialNextPageToken);
  const loading = useSignal(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight &&
        !loading.value &&
        nextPageToken.value
      ) {
        loadMoreVideos();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadMoreVideos = async () => {
    if (!nextPageToken.value) return;

    loading.value = true;
    const response = await fetch(`/videos?pageToken=${nextPageToken.value}`);
    const data = await response.json();
    videos.value = [...videos.value, ...data.items];
    nextPageToken.value = data.nextPageToken;
    loading.value = false;
  };

  return (
    <div>
      {videos.value.map((video) => <VideoItem key={video.id} video={video} />)}
      {loading.value && <p>Loading more videos...</p>}
    </div>
  );
}

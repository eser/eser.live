import { YOUTUBE_CHANNEL_ID } from "../constants.ts";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
}

export async function fetchVideos(
  pageToken?: string,
): Promise<{ items: YouTubeVideo[]; nextPageToken?: string }> {
  const params = new URLSearchParams({
    part: "snippet", // Remove 'statistics' from here
    channelId: YOUTUBE_CHANNEL_ID,
    maxResults: "50",
    key: Deno.env.get("YOUTUBE_API_KEY") ?? "",
    order: "date",
    type: "video",
  });

  if (pageToken) {
    params.append("pageToken", pageToken);
  }

  const url = `${BASE_URL}/search?${params.toString()}`;
  console.log("Fetching URL:", url);

  const response = await fetch(url);
  const data = await response.json();

  console.log("API Response:", JSON.stringify(data, null, 2));

  if (!data.items || !Array.isArray(data.items)) {
    console.error("Unexpected API response structure:", data);
    return { items: [], nextPageToken: undefined };
  }

  const videos: YouTubeVideo[] = data.items
    .filter((item: any) => item.id && item.id.videoId)
    .map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
    }));

  return {
    items: videos,
    nextPageToken: data.nextPageToken,
  };
}

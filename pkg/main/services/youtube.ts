import type { Cursor } from "@/pkg/main/library/data/cursors.ts";
import { YOUTUBE_CHANNEL_ID } from "../constants.ts";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
}

export async function fetchVideos(cursor: Cursor): Promise<{ items: YouTubeVideo[]; nextCursor: string | null }> {
  const params = new URLSearchParams({
    part: "snippet", // Remove 'statistics' from here
    channelId: YOUTUBE_CHANNEL_ID,
    maxResults: cursor.pageSize.toString(),
    key: Deno.env.get("YOUTUBE_API_KEY") ?? "",
    order: "date",
    type: "video",
  });

  if (cursor !== null) {
    params.append("pageToken", cursor.offset);
  }

  const url = `${BASE_URL}/search?${params.toString()}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.items || !Array.isArray(data.items)) {
    console.error("Unexpected API response structure:", data);
    return { items: [], nextCursor: null };
  }

  const videos: YouTubeVideo[] = data.items
    .filter((item) => item.id && item.id.videoId)
    .map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
    }));

  return {
    items: videos,
    nextCursor: data.nextPageToken ?? null,
  };
}

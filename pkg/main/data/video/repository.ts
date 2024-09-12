import { fetchVideos, YouTubeVideo } from "@/pkg/main/services/youtube.ts";

export const videoRepository = {
  async findAll(pageToken?: string) {
    return await fetchVideos(pageToken);
  },
};

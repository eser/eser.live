// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { Cursor } from "@/pkg/main/library/data/cursors.ts";
import { fetchVideos } from "@/pkg/main/services/youtube.ts";

export const videoRepository = {
  async findAll(cursor: Cursor) {
    return await fetchVideos(cursor);
  },
};

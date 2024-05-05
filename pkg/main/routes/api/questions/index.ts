// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { type Handlers } from "$fresh/server.ts";
import { listQuestions } from "@/pkg/main/utils/db.ts";
import { getCursor } from "@/pkg/main/utils/http.ts";

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const iter = listQuestions({
      cursor: getCursor(url),
      limit: 10,
      reverse: true,
    });

    const items = await Array.fromAsync(iter);

    return Response.json({
      items: items.map((x) => x.value),
      cursor: iter.cursor,
    });
  },
};

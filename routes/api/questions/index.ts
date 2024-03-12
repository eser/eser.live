// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { type Handlers } from "$fresh/server.ts";
import { collectValues, listQuestions } from "@/utils/db.ts";
import { getCursor } from "@/utils/http.ts";

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const iter = listQuestions({
      cursor: getCursor(url),
      limit: 10,
      reverse: true,
    });
    const values = await collectValues(iter);
    return Response.json({ values, cursor: iter.cursor });
  },
};

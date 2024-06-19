// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { type Handlers } from "$fresh/server.ts";
import { getUser, listQuestionsByUser } from "@/pkg/main/services/db.ts";
import { getCursor } from "@/pkg/main/library/http/get-cursor.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const user = await getUser(ctx.params.login);

    if (user === null) {
      throw new Deno.errors.NotFound("User not found");
    }

    const url = new URL(req.url);
    const iter = listQuestionsByUser(ctx.params.login, {
      cursor: getCursor(url),
      limit: 10,
    });

    const values = (await Array.fromAsync(iter)).map((x) => x.value);

    return Response.json({ values, cursor: iter.cursor });
  },
};

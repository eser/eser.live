// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { type Handlers } from "$fresh/server.ts";
import { listUsers } from "@/pkg/main/services/users.ts";
import { getCursor } from "@/pkg/main/library/http/get-cursor.ts";

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const iter = listUsers({
      cursor: getCursor(url),
      limit: 10,
    });
    const values = (await Array.fromAsync(iter)).map((x) => x.value);

    return Response.json({ values, cursor: iter.cursor });
  },
};

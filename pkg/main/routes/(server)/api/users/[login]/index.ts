// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { type Handlers } from "$fresh/server.ts";
import { getUser } from "@/pkg/main/services/db.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const user = await getUser(ctx.params.login);
    if (user === null) throw new Deno.errors.NotFound("User not found");
    return Response.json(user);
  },
};

// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { type Handlers } from "$fresh/server.ts";
import { getQuestion } from "@/pkg/main/utils/db.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const question = await getQuestion(ctx.params.id);

    if (question === null) {
      throw new Deno.errors.NotFound("Question not found");
    }

    return Response.json(question);
  },
};

// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { type Handlers } from "$fresh/server.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { questionRepository } from "@/pkg/main/data/repositories/questions.ts";

export const handler: Handlers<undefined, LoggedInState> = {
  async GET(_req, ctx) {
    const item = await questionRepository.findById(ctx.params.id);

    if (item === undefined) {
      throw new Deno.errors.NotFound("Question not found");
    }

    return Response.json(item);
  },
};

// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { type Handlers } from "$fresh/server.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { userRepository } from "@/pkg/main/data/repositories/users.ts";
import { questionRepository } from "@/pkg/main/data/repositories/questions.ts";

export const handler: Handlers<undefined, LoggedInState> = {
  async GET(_req, ctx) {
    const user = await userRepository.findById(ctx.params.id);

    if (user === undefined) {
      throw new Deno.errors.NotFound("User not found");
    }

    const items = await questionRepository.findAllByUserIdWithScores(
      user.id,
      ctx.state.sessionUser?.id,
    );

    return Response.json({
      items: items,
      cursor: null,
    });
  },
};

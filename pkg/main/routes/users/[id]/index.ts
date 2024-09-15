// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { Handlers } from "$fresh/server.ts";
import { userRepository } from "@/pkg/main/data/user/repository.ts";
import { ensurePathParameter, type State } from "@/pkg/main/plugins/session.ts";

export const handler: Handlers<undefined, State> = {
  async GET(_req, ctx) {
    const userId = ensurePathParameter("userId", ctx.params.id);

    const user = await userRepository.findById(userId);

    if (user === null) {
      throw new Deno.errors.NotFound("User not found");
    }

    return Response.json(user);
  },
};

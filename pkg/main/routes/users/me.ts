// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { Handlers } from "$fresh/server.ts";
import { userRepository } from "@/pkg/main/data/user/repository.ts";
import { assertLoggedIn, type LoggedInState } from "@/pkg/main/plugins/session.ts";

export const handler: Handlers<undefined, LoggedInState> = {
  async GET(_req, ctx) {
    assertLoggedIn(ctx);

    const user = await userRepository.findById(ctx.state.sessionUser.id);

    if (user === null) {
      throw new Deno.errors.NotFound("User not found");
    }

    return Response.json(user);
  },
};

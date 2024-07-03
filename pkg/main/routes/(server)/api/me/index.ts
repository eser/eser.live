// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { type Handlers } from "$fresh/server.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { userRepository } from "@/pkg/main/data/repositories/users.ts";

export const handler: Handlers<undefined, LoggedInState> = {
  async GET(_req, ctx) {
    const user = await userRepository.findById(ctx.state.sessionUser.id);

    if (user === undefined) {
      throw new Deno.errors.NotFound("User not found");
    }

    return Response.json(user);
  },
};

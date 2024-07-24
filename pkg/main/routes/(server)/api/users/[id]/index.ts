// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Handlers } from "$fresh/server.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { userRepository } from "@/pkg/main/data/repositories/users.ts";

export const handler: Handlers<undefined, LoggedInState> = {
  async GET(_req, ctx) {
    const user = await userRepository.findById(ctx.params.id);

    if (user === undefined) {
      throw new Deno.errors.NotFound("User not found");
    }

    return Response.json(user);
  },
};

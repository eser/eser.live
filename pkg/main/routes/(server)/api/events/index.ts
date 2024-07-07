// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { type Handlers } from "$fresh/server.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { eventRepository } from "@/pkg/main/data/repositories/events.ts";

export const handler: Handlers<undefined, LoggedInState> = {
  async GET(_req, ctx) {
    const items = await eventRepository.findAllWithStats(
      ctx.state.sessionUser?.id,
    );

    return Response.json({
      items: items,
      cursor: null,
    });
  },
};

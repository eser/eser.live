// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Handlers } from "$fresh/server.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { eventRepository } from "@/pkg/main/data/repositories/events.ts";

const PAGE_SIZE = 10;

export const handler: Handlers<undefined, LoggedInState> = {
  async GET(req, ctx) {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const cursor = getCursor(req.url, PAGE_SIZE);
    const items = await eventRepository.findAllWithStats(
      cursor,
      twoHoursAgo,
      ctx.state.sessionUser?.id,
    );

    return Response.json({
      items: items,
      cursor: items.at(-1)?.id ?? null,
    });
  },
};

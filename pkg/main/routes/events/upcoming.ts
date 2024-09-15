// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { Handlers } from "$fresh/server.ts";
import { eventRepository } from "@/pkg/main/data/event/repository.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { ensureMediaTypes, type State } from "@/pkg/main/plugins/session.ts";

type HandlerResult = {
  payload: Awaited<ReturnType<typeof eventRepository.findAllWithStats>>;
};

const PAGE_SIZE = 10;

export const handler: Handlers<HandlerResult, State> = {
  async GET(req, ctx) {
    ensureMediaTypes(req, ["application/json"]);

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const cursor = getCursor(req.url, PAGE_SIZE);
    const upcomingEvents = await eventRepository.findAllWithStats(
      cursor,
      twoHoursAgo,
      ctx.state.sessionUser?.id ?? null,
    );

    const result: HandlerResult = {
      payload: upcomingEvents,
    };

    return Response.json(result.payload);
  },
};

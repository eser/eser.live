// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { Handlers } from "$fresh/server.ts";
import { eventRepository } from "@/pkg/main/data/event/repository.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { ensureMediaTypes, type State } from "@/pkg/main/plugins/session.ts";

const PAGE_SIZE = 10;

export const handler: Handlers<undefined, State> = {
  async GET(req, ctx) {
    ensureMediaTypes(req, ["application/json"]);

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const cursor = getCursor(req.url, PAGE_SIZE);
    const result = await eventRepository.findAllWithStats(cursor, twoHoursAgo, ctx.state.sessionUser?.id ?? null);

    return Response.json(result);
  },
};

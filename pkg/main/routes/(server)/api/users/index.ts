// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Handlers } from "$fresh/server.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { userRepository } from "@/pkg/main/data/repositories/users.ts";

const PAGE_SIZE = 10;

export const handler: Handlers<undefined, LoggedInState> = {
  async GET(req, _ctx) {
    const cursor = getCursor(req.url, PAGE_SIZE);
    const items = await userRepository.findAllWithDetails(cursor);

    return Response.json({
      items: items,
      cursor: items.at(-1)?.id ?? null,
    });
  },
};

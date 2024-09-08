// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Handlers } from "$fresh/server.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import { userRepository } from "@/pkg/main/data/user/repository.ts";

const PAGE_SIZE = 10;

export const handler: Handlers<undefined, State> = {
  async GET(req, _ctx) {
    const cursor = getCursor(req.url, PAGE_SIZE);
    const result = await userRepository.findAll(cursor);

    return Response.json(result);
  },
};

// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { Cursor } from "@/pkg/main/library/data/cursors.ts";
import { fetchProjects } from "@/pkg/main/services/github.ts";

export const projectRepository = {
  async findAll(cursor: Cursor) {
    return await fetchProjects("user:eser topic:eser-live", cursor);
  },
};

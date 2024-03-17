// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { Handlers } from "$fresh/server.ts";
import { redirect } from "@/pkg/main/utils/http.ts";

export const handler: Handlers = {
  GET() {
    return redirect("/manage/stats");
  },
};

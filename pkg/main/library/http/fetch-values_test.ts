// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { returnsNext, stub } from "std/testing/mock.ts";
import { assertEquals, assertRejects } from "std/assert/mod.ts";
import { STATUS_CODE } from "$fresh/server.ts";
import { Question, randomQuestion } from "@/pkg/main/services/db.ts";
import { fetchValues } from "./fetch-values.ts";

Deno.test("[http] fetchValues()", async () => {
  const resp1 = Promise.resolve(
    new Response(null, { status: STATUS_CODE.NotFound }),
  );
  const resp2Body = {
    items: [randomQuestion(), randomQuestion()],
    cursor: crypto.randomUUID(),
  };
  const resp2Cursor = crypto.randomUUID();
  const resp2 = Promise.resolve(Response.json(resp2Body));
  const fetchStub = stub(
    globalThis,
    "fetch",
    returnsNext([resp1, resp2]),
  );
  const endpoint = "http://localhost";
  await assertRejects(
    async () => await fetchValues(endpoint, ""),
    Error,
    `Request failed: GET ${endpoint}`,
  );
  assertEquals(
    await fetchValues<Question>(endpoint + "/api/questions", resp2Cursor),
    resp2Body,
  );

  fetchStub.restore();
});

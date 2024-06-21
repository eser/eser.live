// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { assertRejects } from "std/assert/assert_rejects.ts";
import { returnsNext, stub } from "std/testing/mock.ts";
import { assertEquals } from "std/assert/assert_equals.ts";
import { ulid } from "std/ulid/mod.ts";
import { Status } from "kv_oauth/deps.ts";
import { BadRequestError } from "@/pkg/main/library/http/bad-request-error.ts";
import { getGitHubUser } from "./github.ts";

Deno.test("[plugins] getGitHubUser()", async (test) => {
  await test.step("rejects on error message", async () => {
    const message = ulid();
    const fetchStub = stub(
      window,
      "fetch",
      returnsNext([
        Promise.resolve(
          Response.json({ message }, { status: Status.BadRequest }),
        ),
      ]),
    );
    await assertRejects(
      async () => await getGitHubUser(ulid()),
      BadRequestError,
      message,
    );
    fetchStub.restore();
  });

  await test.step("resolves to a GitHub user object", async () => {
    const body = { login: ulid(), email: ulid() };
    const fetchStub = stub(
      window,
      "fetch",
      returnsNext([Promise.resolve(Response.json(body))]),
    );
    assertEquals(await getGitHubUser(ulid()), body);
    fetchStub.restore();
  });
});

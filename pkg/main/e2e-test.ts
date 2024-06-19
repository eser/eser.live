// Copyright 2024-present the Deno authors. All rights reserved. MIT license.

import { createHandler, STATUS_CODE } from "$fresh/server.ts";
import {
  assert,
  assertArrayIncludes,
  assertEquals,
  assertInstanceOf,
  assertNotEquals,
  assertObjectMatch,
  assertStringIncludes,
} from "std/assert/mod.ts";
import { isRedirectStatus } from "std/http/status.ts";
import { returnsNext, stub } from "std/testing/mock.ts";
import manifest from "@/pkg/main/fresh.gen.ts";
import {
  createQuestion,
  createUser,
  createVote,
  getUser,
  listQuestionsByUser,
  type Question,
  randomQuestion,
  randomUser,
} from "@/pkg/main/services/db.ts";
import options from "@/pkg/main/fresh.config.ts";
import { _internals } from "@/pkg/main/plugins/kv-oauth.ts";

/**
 * These tests are end-to-end tests, which follow this rule-set:
 * 1. `Response.status` is checked first by using the `Status` enum. It's the
 * primary indicator of whether the request was successful or not.
 * 2. `Response.header`'s `content-type` is checked next to ensure the
 * response is of the expected type. This is where custom assertions are used.
 * 3. `Response.body` is checked last, if needed. This is where the actual
 * content of the response is checked. Here, we're checking if the body is
 * instance of a specific type, equals a specific string, contains a specific
 * string or is empty.
 */

/**
 * @see {@link https://fresh.deno.dev/docs/examples/writing-tests|Writing tests} example on how to write tests for Fresh projects.
 */
const handler = await createHandler(manifest, options);

function assertHtml(resp: Response) {
  assertInstanceOf(resp.body, ReadableStream);
  assertEquals(resp.headers.get("content-type"), "text/html; charset=utf-8");
}

function assertJson(resp: Response) {
  assertInstanceOf(resp.body, ReadableStream);
  assertEquals(resp.headers.get("content-type"), "application/json");
}

function assertXml(resp: Response) {
  assertInstanceOf(resp.body, ReadableStream);
  assertEquals(
    resp.headers.get("content-type"),
    "application/atom+xml; charset=utf-8",
  );
}

function assertText(resp: Response) {
  assertInstanceOf(resp.body, ReadableStream);
  assertEquals(resp.headers.get("content-type"), "text/plain;charset=UTF-8");
}

function assertRedirect(response: Response, location: string) {
  assert(isRedirectStatus(response.status));
  assert(response.headers.get("location")?.includes(location));
}

Deno.test("[e2e] security headers", async () => {
  const resp = await handler(new Request("http://localhost"));

  assertEquals(
    resp.headers.get("strict-transport-security"),
    "max-age=63072000;",
  );
  assertEquals(
    resp.headers.get("referrer-policy"),
    "strict-origin-when-cross-origin",
  );
  assertEquals(resp.headers.get("x-content-type-options"), "nosniff");
  assertEquals(resp.headers.get("x-frame-options"), "SAMEORIGIN");
  assertEquals(resp.headers.get("x-xss-protection"), "1; mode=block");
});

Deno.test("[e2e] GET /", async () => {
  const resp = await handler(new Request("http://localhost"));

  assertEquals(resp.status, STATUS_CODE.OK);
  assertHtml(resp);
});

Deno.test("[e2e] GET /auth/callback", async (test) => {
  const login = crypto.randomUUID();
  const sessionId = crypto.randomUUID();

  await test.step("creates a new user if it doesn't already exist", async () => {
    const handleCallbackResp = {
      response: new Response(),
      tokens: {
        accessToken: crypto.randomUUID(),
        tokenType: crypto.randomUUID(),
      },
      sessionId,
    };
    // const id = crypto.randomUUID();
    const handleCallbackStub = stub(
      _internals,
      "handleCallback",
      returnsNext([Promise.resolve(handleCallbackResp)]),
    );
    const githubRespBody = {
      login,
      email: crypto.randomUUID(),
    };
    const fetchStub = stub(
      window,
      "fetch",
      returnsNext([
        Promise.resolve(Response.json(githubRespBody)),
      ]),
    );
    const req = new Request("http://localhost/auth/callback");
    await handler(req);
    handleCallbackStub.restore();
    fetchStub.restore();

    const user = await getUser(githubRespBody.login);
    assert(user !== null);
    assertEquals(user.sessionId, handleCallbackResp.sessionId);
  });

  await test.step("updates the user session ID if they already exist", async () => {
    const handleCallbackResp = {
      response: new Response(),
      tokens: {
        accessToken: crypto.randomUUID(),
        tokenType: crypto.randomUUID(),
      },
      sessionId: crypto.randomUUID(),
    };
    // const id = crypto.randomUUID();
    const handleCallbackStub = stub(
      _internals,
      "handleCallback",
      returnsNext([Promise.resolve(handleCallbackResp)]),
    );
    const githubRespBody = {
      login,
      email: crypto.randomUUID(),
    };
    const fetchStub = stub(
      window,
      "fetch",
      returnsNext([
        Promise.resolve(Response.json(githubRespBody)),
      ]),
    );
    const req = new Request("http://localhost/auth/callback");
    await handler(req);
    handleCallbackStub.restore();
    fetchStub.restore();

    const user = await getUser(githubRespBody.login);
    assert(user !== null);
    assertNotEquals(user.sessionId, sessionId);
  });
});

Deno.test("[e2e] GET /blog", async () => {
  const resp = await handler(
    new Request("http://localhost/blog"),
  );

  assertEquals(resp.status, STATUS_CODE.OK);
  assertHtml(resp);
});

Deno.test("[e2e] GET /auth/login", async () => {
  const resp = await handler(
    new Request("http://localhost/auth/login"),
  );

  assertRedirect(
    resp,
    "https://github.com/login/oauth/authorize",
  );
});

Deno.test("[e2e] GET /auth/logout", async () => {
  const resp = await handler(
    new Request("http://localhost/auth/logout"),
  );

  assertRedirect(resp, "/");
});

Deno.test("[e2e] GET /dash", async (test) => {
  const url = "http://localhost/dash";

  const user = randomUser();
  await createUser(user);

  const userEditor = randomUser("eser");
  await createUser(userEditor);

  await test.step("redirects to sign-in page if the session user is not logged in", async () => {
    const resp = await handler(new Request(url));

    assertRedirect(resp, "/auth/login");
  });

  await test.step("redirects to sign-in page if the session user is not an editor", async () => {
    const resp = await handler(
      new Request(url, {
        headers: { cookie: "site-session=" + user.sessionId },
      }),
    );

    assertRedirect(resp, "/auth/login");
  });

  await test.step("redirects to `/dash/stats/` when the session user is an editor", async () => {
    const resp = await handler(
      new Request(url, {
        headers: { cookie: "site-session=" + userEditor.sessionId },
      }),
    );

    assertRedirect(resp, "/dash/stats/");
  });
});

Deno.test("[e2e] GET /dash/stats/", async (test) => {
  const url = "http://localhost/dash/stats/";

  const user = randomUser();
  await createUser(user);

  const userEditor = randomUser("eser");
  await createUser(userEditor);

  await test.step("redirects to sign-in page if the session user is not logged in", async () => {
    const resp = await handler(new Request(url));

    assertRedirect(resp, "/auth/login");
  });

  await test.step("renders dashboard stats chart for a user who is not an editor", async () => {
    const resp = await handler(
      new Request(url, {
        headers: { cookie: "site-session=" + user.sessionId },
      }),
    );

    assertRedirect(resp, "/auth/login");
  });

  await test.step("renders dashboard stats chart for a user who is an editor", async () => {
    const resp = await handler(
      new Request(url, {
        headers: { cookie: "site-session=" + userEditor.sessionId },
      }),
    );

    assertEquals(resp.status, STATUS_CODE.OK);
    assertHtml(resp);
    assertStringIncludes(await resp.text(), "<!--frsh-chart_default");
  });
});

Deno.test("[e2e] GET /dash/users/", async (test) => {
  const url = "http://localhost/dash/users/";

  const user = randomUser();
  await createUser(user);

  const userEditor = randomUser("eser");
  await createUser(userEditor);

  await test.step("redirects to sign-in if the session user is not logged in", async () => {
    const resp = await handler(new Request(url));

    assertRedirect(resp, "/auth/login");
  });

  await test.step("renders dashboard stats table for a user who is not an editor", async () => {
    const resp = await handler(
      new Request(url, {
        headers: { cookie: "site-session=" + user.sessionId },
      }),
    );

    assertRedirect(resp, "/auth/login");
  });

  await test.step("renders dashboard stats table for a user who is an editor", async () => {
    const resp = await handler(
      new Request(url, {
        headers: { cookie: "site-session=" + userEditor.sessionId },
      }),
    );

    assertEquals(resp.status, STATUS_CODE.OK);
    assertHtml(resp);
    assertStringIncludes(await resp.text(), "<!--frsh-userstable_default");
  });
});

Deno.test("[e2e] GET /qa", async () => {
  const resp = await handler(
    new Request("http://localhost/qa"),
  );

  assertEquals(resp.status, STATUS_CODE.OK);
  assertHtml(resp);
});

Deno.test("[e2e] GET /qa/ask", async () => {
  const resp = await handler(
    new Request("http://localhost/qa/ask"),
  );

  assertEquals(resp.status, STATUS_CODE.OK);
  assertHtml(resp);
});

Deno.test("[e2e] GET /blog/feed", async () => {
  const resp = await handler(
    new Request("http://localhost/blog/feed"),
  );

  assertEquals(resp.status, STATUS_CODE.OK);
  assertXml(resp);
});

Deno.test("[e2e] GET /api/questions", async () => {
  const question1 = randomQuestion();
  const question2 = randomQuestion();
  await createQuestion(question1);
  await createQuestion(question2);
  const req = new Request("http://localhost/api/questions");
  const resp = await handler(req);
  const { items } = await resp.json();

  assertEquals(resp.status, STATUS_CODE.OK);
  assertJson(resp);
  assertArrayIncludes(items, [question1, question2]);
});

Deno.test("[e2e] POST /qa/ask", async (test) => {
  const url = "http://localhost/qa/ask";

  const user = randomUser();
  await createUser(user);

  await test.step("redirects to `/qa/ask?error` if question is missing", async () => {
    const body = new FormData();
    const resp = await handler(
      new Request(url, {
        method: "POST",
        headers: { cookie: "site-session=" + user.sessionId },
        body,
      }),
    );

    assertRedirect(resp, "/qa/ask?error");
  });

  await test.step("redirects to `/qa/ask?error` if question is missing input", async () => {
    const body = new FormData();
    body.set("question", "");

    const resp = await handler(
      new Request(url, {
        method: "POST",
        headers: { cookie: "site-session=" + user.sessionId },
        body,
      }),
    );

    assertRedirect(resp, "/qa/ask?error");
  });

  await test.step("creates an question and redirects to the home page", async () => {
    const question = { question: "Sample question" };
    const body = new FormData();
    body.set("question", question.question);
    const resp = await handler(
      new Request(url, {
        method: "POST",
        headers: { cookie: "site-session=" + user.sessionId },
        body,
      }),
    );
    const questions = await Array.fromAsync(listQuestionsByUser(user.login));

    assertRedirect(resp, "/qa");
    // Deep partial match since the question ID is a ULID generated at runtime
    assertObjectMatch(questions[0].value, question);
  });
});

Deno.test("[e2e] GET /api/questions/[id]", async (test) => {
  const question = randomQuestion();
  const req = new Request("http://localhost/api/questions/" + question.id);

  await test.step("serves not found response if question not found", async () => {
    const resp = await handler(req);

    assertEquals(resp.status, STATUS_CODE.NotFound);
    assertEquals(await resp.text(), "Question not found");
  });

  await test.step("serves question as JSON", async () => {
    await createQuestion(question);
    const resp = await handler(req);

    assertEquals(resp.status, STATUS_CODE.OK);
    assertJson(resp);
    assertEquals(await resp.json(), question);
  });
});

Deno.test("[e2e] GET /api/users", async () => {
  const user1 = randomUser();
  const user2 = randomUser();
  await createUser(user1);
  await createUser(user2);

  const req = new Request("http://localhost/api/users");
  const resp = await handler(req);

  const { items } = await resp.json();

  assertEquals(resp.status, STATUS_CODE.OK);
  assertJson(resp);
  assertArrayIncludes(items, [user1, user2]);
});

Deno.test("[e2e] GET /api/users/[login]", async (test) => {
  const user = randomUser();
  const req = new Request("http://localhost/api/users/" + user.login);

  await test.step("serves not found response if user not found", async () => {
    const resp = await handler(req);

    assertEquals(resp.status, STATUS_CODE.NotFound);
    assertText(resp);
    assertEquals(await resp.text(), "User not found");
  });

  await test.step("serves user as JSON", async () => {
    await createUser(user);
    const resp = await handler(req);

    assertEquals(resp.status, STATUS_CODE.OK);
    assertJson(resp);
    assertEquals(await resp.json(), user);
  });
});

Deno.test("[e2e] GET /api/users/[login]/questions", async (test) => {
  const user = randomUser();
  const question: Question = {
    ...randomQuestion(),
    userLogin: user.login,
  };
  const req = new Request(`http://localhost/api/users/${user.login}/questions`);

  await test.step("serves not found response if user not found", async () => {
    const resp = await handler(req);

    assertEquals(resp.status, STATUS_CODE.NotFound);
    assertText(resp);
    assertEquals(await resp.text(), "User not found");
  });

  await test.step("serves questions as JSON", async () => {
    await createUser(user);
    await createQuestion(question);
    const resp = await handler(req);
    const { items } = await resp.json();

    assertEquals(resp.status, STATUS_CODE.OK);
    assertJson(resp);
    assertArrayIncludes(items, [question]);
  });
});

Deno.test("[e2e] POST /api/questions/vote", async (test) => {
  const question = randomQuestion();
  const user = randomUser();
  await createQuestion(question);
  await createUser(user);
  const url = `http://localhost/api/questions/vote?question_id=${question.id}`;

  await test.step("serves unauthorized response if the session user is not logged in", async () => {
    const resp = await handler(new Request(url, { method: "POST" }));

    assertEquals(resp.status, STATUS_CODE.Unauthorized);
    assertText(resp);
    assertEquals(await resp.text(), "User must be logged in");
  });

  await test.step("serves not found response if the question is not found", async () => {
    const resp = await handler(
      new Request("http://localhost/api/questions/vote?question_id=bob-ross", {
        method: "POST",
        headers: { cookie: "site-session=" + user.sessionId },
      }),
    );

    assertEquals(resp.status, STATUS_CODE.NotFound);
    assertText(resp);
    assertEquals(await resp.text(), "Question not found");
  });

  await test.step("creates a vote", async () => {
    const question = { ...randomQuestion(), userLogin: user.login };
    await createQuestion(question);
    const resp = await handler(
      new Request(url, {
        method: "POST",
        headers: { cookie: "site-session=" + user.sessionId },
      }),
    );

    assertEquals(resp.status, STATUS_CODE.Created);
  });

  await test.step("serves an error response if the `question_id` URL parameter is missing", async () => {
    const resp = await handler(
      new Request("http://localhost/api/questions/vote", {
        method: "POST",
        headers: { cookie: "site-session=" + user.sessionId },
      }),
    );

    assertEquals(resp.status, STATUS_CODE.BadRequest);
    assertEquals(await resp.text(), "`question_id` URL parameter missing");
  });
});

Deno.test("[e2e] GET /dash", async (test) => {
  const url = "http://localhost/dash";

  await test.step("redirects to sign-in page if the session user is not logged in", async () => {
    const resp = await handler(new Request(url));

    assertRedirect(resp, "/auth/login");
  });

  await test.step("serves a web page for logged-in user", async () => {
    const user = randomUser();
    await createUser(user);

    const resp = await handler(
      new Request(url, {
        headers: { cookie: "site-session=" + user.sessionId },
      }),
    );

    assertEquals(resp.status, STATUS_CODE.OK);
    assertHtml(resp);
  });
});

Deno.test("[e2e] GET /api/me/question-votes", async () => {
  const user = randomUser();
  await createUser(user);
  const question1 = randomQuestion();
  const question2 = randomQuestion();
  await createQuestion(question1);
  await createQuestion(question2);
  await createVote({
    userLogin: user.login,
    questionId: question1.id,
  });
  await createVote({
    userLogin: user.login,
    questionId: question2.id,
  });
  const resp = await handler(
    new Request("http://localhost/api/me/question-votes", {
      headers: { cookie: "site-session=" + user.sessionId },
    }),
  );
  const body = await resp.json();

  assertEquals(resp.status, STATUS_CODE.OK);
  assertJson(resp);
  assertArrayIncludes(body, [{ ...question1, score: 1 }, {
    ...question2,
    score: 1,
  }]);
});

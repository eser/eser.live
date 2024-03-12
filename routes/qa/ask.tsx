// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { defineRoute, Handlers } from "$fresh/server.ts";
import Head from "@/components/head.tsx";
import {
  assertLoggedIn,
  type LoggedInState,
  State,
} from "@/plugins/session.ts";
import { HEADING_STYLES, INPUT_STYLES } from "@/utils/constants.ts";
import { createQuestion } from "@/utils/db.ts";
import { redirect } from "@/utils/http.ts";
import { ulid } from "std/ulid/mod.ts";
import IconCheckCircle from "tabler_icons_tsx/circle-check.tsx";
import IconCircleX from "tabler_icons_tsx/circle-x.tsx";
import IconMailForward from "tabler_icons_tsx/mail-forward.tsx";
import IconInfo from "tabler_icons_tsx/info-circle.tsx";

const SEND_STYLES =
  "flex flex-row gap-2 text-center text-white rounded-lg bg-secondary px-4 py-2";

export const handler: Handlers<undefined, LoggedInState> = {
  async POST(req, ctx) {
    assertLoggedIn(ctx);

    const form = await req.formData();
    const question = form.get("question");

    if (
      typeof question !== "string" || question === ""
    ) {
      return redirect("/qa/ask?error");
    }

    await createQuestion({
      id: ulid(),
      userLogin: ctx.state.sessionUser.login,
      question,
      score: 0,
      hidden: false,
    });
    return redirect("/qa");
  },
};

export default defineRoute<State>((_req, ctx) => {
  return (
    <>
      <Head title="Soru / Yanıt: Sor" href={ctx.url.href} />
      <main class="flex-1 flex flex-col justify-center mx-auto w-full space-y-16 p-4 max-w-6xl">
        <div class="text-center">
          <h1 class={HEADING_STYLES}>
            Soru sor
          </h1>
          <p class="text-slate-500">
            Yanıtlanması gerektiğini düşündüğün, merak ettiğin bir soru
            sor.<br class="hidden sm:inline" /> Biz de{" "}
            <a href="https://www.youtube.com/@eserlive/live">
              <span class="bg-green-100 dark:bg-gray-800 p-1 rounded">
                eser.live
              </span>
            </a>{" "}
            üzerinde onu yanıtlayalım.
          </p>
        </div>
        <div class="flex flex-col md:flex-row gap-8 md:gap-16 md:items-center">
          <div class="flex-1 space-y-6">
            <p>
              <IconCircleX class="inline-block mr-2" />
              Daha önce sorulmuş bir soruyu tekrar <strong>sorma</strong>
            </p>
            <p>
              <IconCircleX class="inline-block mr-2" />
              Deneme veya boş soru gönderimi <strong>yapma</strong>
            </p>
            <div>
              <IconCheckCircle class="inline-block mr-2" />
              Mümkün olduğunca açık, anlaşılır ve kısa sorular{" "}
              <strong>sor</strong>
            </div>
            <p>
            </p>
          </div>
          <form
            class="flex-1 flex flex-col justify-center"
            method="post"
          >
            <div>
              <label
                htmlFor="share_question"
                class="block text-sm font-medium leading-6 text-slate-900 dark:text-white"
              >
                Soru:
              </label>
              <textarea
                id="share_question"
                class={`${INPUT_STYLES} w-full mt-2`}
                rows={6}
                name="question"
                required={true}
                placeholder={ctx.state.sessionUser === undefined
                  ? "Soru sorabilmek için giriş yapmış olman gerekiyor"
                  : "Soru içeriğini buraya girebilirsin"}
                disabled={ctx.state.sessionUser === undefined}
              >
              </textarea>
            </div>

            {ctx.url.searchParams.has("error") && (
              <div class="w-full text-red-500 mt-4">
                <IconInfo class="inline-block" /> Question body is required
              </div>
            )}
            <div class="my-10 flex flex-row gap-6 justify-center md:justify-end">
              {!ctx.state.sessionUser
                ? (
                  <a href="/auth/login" class={SEND_STYLES}>
                    <IconMailForward class="h-6 w-6" />
                    Soru göndermek için giriş yapın &#8250;
                  </a>
                )
                : (
                  <button class={SEND_STYLES}>
                    <IconMailForward class="h-6 w-6" />
                    Soruyu gönder &#8250;
                  </button>
                )}
            </div>
          </form>
        </div>
      </main>
    </>
  );
});

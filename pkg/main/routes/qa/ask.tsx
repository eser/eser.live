// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as ulid from "@std/ulid";
import IconCheckCircle from "tabler_icons_tsx/circle-check.tsx";
import IconCircleX from "tabler_icons_tsx/circle-x.tsx";
import IconMailForward from "tabler_icons_tsx/mail-forward.tsx";
import IconInfo from "tabler_icons_tsx/info-circle.tsx";
import { defineRoute, Handlers } from "$fresh/server.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import {
  assertLoggedIn,
  type LoggedInState,
  type State,
} from "@/pkg/main/plugins/session.ts";
import { questionRepository } from "@/pkg/main/data/repositories/questions.ts";
import { redirect } from "@/pkg/main/library/http/redirect.ts";

export const handler: Handlers<undefined, LoggedInState> = {
  async POST(req, ctx) {
    assertLoggedIn(ctx);

    const form = await req.formData();
    const questionContent = form.get("question_content");
    const questionIsAnonymous = form.get("question_is_anonymous") === "true";

    if (
      questionContent === null || questionContent === undefined ||
      questionContent.constructor !== String ||
      questionContent.length < 1
    ) {
      return redirect("/qa/ask?error");
    }

    await questionRepository.create({
      id: ulid.ulid(),

      userId: ctx.state.sessionUser.id,

      content: questionContent,
      answerKind: null,
      answerContent: null,
      answerUri: null,
      answeredAt: null,

      isHidden: false,
      isAnonymous: questionIsAnonymous,
    });

    return redirect("/qa");
  },
};

export default defineRoute<State>((_req, ctx) => {
  return (
    <>
      <Head title="Soru / Yanıt: Sor" href={ctx.url.href} />
      <main class="flex-1 flex flex-col justify-center mx-auto w-full space-y-16 p-4 max-w-6xl">
        <section class="text-center">
          <h1 class="text-3xl font-bold">
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
        </section>
        <section class="flex flex-col md:flex-row gap-8 md:gap-16">
          <div class="flex-1 space-y-6">
            <div class="flex">
              <IconCircleX class="inline-block mr-2" />
              Daha önce sorulmuş bir soruyu tekrar &nbsp;
              <strong>sorma</strong>
            </div>
            <div class="flex">
              <IconCircleX class="inline-block mr-2" />
              Deneme veya boş soru gnderimi &nbsp;
              <strong>yapma</strong>
            </div>
            <div class="flex">
              <IconCheckCircle class="inline-block mr-2" />
              Mümkün olduğunca açık, anlaşılır ve kısa sorular &nbsp;
              <strong>sor</strong>
            </div>
          </div>
          <form
            class="flex-1 flex flex-col justify-center"
            method="post"
          >
            <div>
              <label
                htmlFor="question_content"
                class="block text-sm font-medium leading-6 text-slate-900 dark:text-white"
              >
                Soru:
              </label>
              <textarea
                id="question_content"
                class={`px-4 py-2 rounded rounded-lg outline-none border-1 border-gray-300 hover:border-black transition duration-100 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:border-white w-full mt-2`}
                rows={6}
                name="question_content"
                required={true}
                placeholder={ctx.state.sessionUser === undefined
                  ? "Soru sorabilmek için giriş yapmış olman gerekiyor"
                  : "Soru içeriğini buraya girebilirsin"}
                disabled={ctx.state.sessionUser === undefined}
              >
              </textarea>
            </div>
            <div>
              <div class="form-control">
                <label class="label cursor-pointer justify-start gap-x-2">
                  <input
                    id="question_is_anonymous"
                    class="checkbox"
                    name="question_is_anonymous"
                    type="checkbox"
                    checked={false}
                    value="true"
                    disabled={ctx.state.sessionUser === undefined}
                  />
                  <span class="label-text">Anonim olarak sor</span>
                </label>
              </div>
            </div>

            {ctx.url.searchParams.has("error") && (
              <div class="w-full text-error mt-4 flex align-center">
                <IconInfo class="inline-block mr-2" />
                Soru için bir metin girmelisiniz.
              </div>
            )}
            <div class="my-10 flex flex-row gap-6 justify-center md:justify-end">
              {!ctx.state.sessionUser
                ? (
                  <a href="/auth/login" class="btn btn-warning">
                    <IconMailForward class="h-6 w-6" />
                    Soru göndermek için giriş yapın &#8250;
                  </a>
                )
                : (
                  <button class="border-0 btn btn-primary">
                    <IconMailForward class="h-6 w-6" />
                    Soruyu gönder &#8250;
                  </button>
                )}
            </div>
          </form>
        </section>
      </main>
    </>
  );
});

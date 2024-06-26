// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { ulid } from "std/ulid/mod.ts";
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
import { createQuestion } from "@/pkg/main/services/questions.ts";
import { redirect } from "@/pkg/main/library/http/redirect.ts";

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
                htmlFor="share_question"
                class="block text-sm font-medium leading-6 text-slate-900 dark:text-white"
              >
                Soru:
              </label>
              <textarea
                id="share_question"
                class={`px-4 py-2 rounded rounded-lg outline-none border-1 border-gray-300 hover:border-black transition duration-100 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:border-white w-full mt-2`}
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
                  <a href="/auth/login" class="btn btn-warning">
                    <IconMailForward class="h-6 w-6" />
                    Soru göndermek için giriş yapın &#8250;
                  </a>
                )
                : (
                  <button class="btn btn-primary">
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

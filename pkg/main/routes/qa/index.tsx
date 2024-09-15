// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { Handlers, PageProps } from "$fresh/server.ts";
import IconMessageCircleQuestion from "tabler_icons_tsx/message-circle-question.tsx";
import { questionRepository } from "@/pkg/main/data/question/repository.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { ensureMediaTypes, type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { QuestionList } from "./(_islands)/list.tsx";

type HandlerResult = {
  payload: Awaited<ReturnType<typeof questionRepository.findAllWithScores>>;
};

type QuestionItem = HandlerResult["payload"]["items"][number];

const PAGE_SIZE = 10;

const anonymize = (question: QuestionItem) => {
  if (question.isAnonymous) {
    return { ...question, user: null };
  }

  return question;
};

export const handler: Handlers<HandlerResult, State> = {
  async GET(req, ctx) {
    const mediaTypes = ensureMediaTypes(req, ["application/json", "text/html"]);

    const cursor = getCursor(req.url, PAGE_SIZE);
    const questions = await questionRepository.findAllWithScores(cursor, ctx.state.sessionUser?.id ?? null);

    questions.items.forEach((x) => anonymize(x));

    const result: HandlerResult = {
      payload: questions,
    };

    if (mediaTypes.includes("application/json")) {
      return Response.json(result.payload);
    }

    return ctx.render(result);
  },
};

const AskQuestionButton = () => {
  return (
    <div class="my-10 flex flex-row gap-6 justify-center">
      <a href="/qa/ask" class="btn btn-wide btn-primary">
        <IconMessageCircleQuestion class="h-6 w-6" />
        Soru sor &#8250;
      </a>
    </div>
  );
};

export default function (props: PageProps<HandlerResult, State>) {
  const isLoggedIn = props.state.sessionUser !== null;
  const isEditor = props.state.isEditor;

  return (
    <>
      <Head title="Soru / Yanıt" href={props.url.href} />
      <main>
        <div class="content-area">
          <h1>Soru / Yanıt</h1>
          <QuestionList
            initialItems={props.data.payload.items}
            initialNextCursor={props.data.payload.nextCursor}
            baseUri={props.url.href}
            isLoggedIn={isLoggedIn}
            isEditor={isEditor}
          />

          <AskQuestionButton />
        </div>
      </main>
    </>
  );
}

// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { Signal, useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import IconInfo from "tabler_icons_tsx/info-circle.tsx";
import IconMessageCircleQuestion from "tabler_icons_tsx/message-circle-question.tsx";
import { decodeTime } from "std/ulid/mod.ts";
import GitHubAvatarImg from "@/pkg/main/components/github-avatar-img.tsx";
import { type Question } from "@/pkg/main/utils/db.ts";
import { LINK_STYLES } from "@/pkg/main/utils/constants.ts";
import { fetchValues } from "@/pkg/main/utils/http.ts";
import { timeAgo } from "@/pkg/main/utils/display.ts";

async function fetchVotedQuestions() {
  const url = "/api/me/question-votes";
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Request failed: GET ${url}`);
  return await resp.json() as Question[];
}

function EmptyQuestionsList() {
  return (
    <div class="flex flex-col justify-center items-center gap-2 pt-16">
      <IconInfo class="w-10 h-10 text-slate-400 dark:text-slate-600" />
      <p>Henüz herhangi bir soru sorulmamış</p>
    </div>
  );
}

interface VoteButtonProps {
  question: Question;
  scoreSig: Signal<number>;
  isVotedSig: Signal<boolean>;
}

function VoteButton(props: VoteButtonProps) {
  async function onClick(event: MouseEvent) {
    if (event.detail !== 1) {
      return;
    }

    const resp = await fetch(
      `/api/questions/vote?question_id=${props.question.id}`,
      {
        method: "POST",
      },
    );

    if (!resp.ok) {
      throw new Error(await resp.text());
    }

    props.scoreSig.value++;
    props.isVotedSig.value = true;
  }

  if (props.isVotedSig.value) {
    return (
      <button class="text-primary">
        ▲
      </button>
    );
  }

  return (
    <button onClick={onClick} class="hover:text-primary">
      ▲
    </button>
  );
}

interface HideLinkProps {
  question: Question;
  isHiddenSig: Signal<boolean>;
}

function HideLink(props: HideLinkProps) {
  async function onClick(event: MouseEvent) {
    event.preventDefault();

    if (event.detail !== 1) {
      return;
    }

    const resp = await fetch(
      `/api/questions/hide?question_id=${props.question.id}`,
      {
        method: "POST",
      },
    );

    if (!resp.ok) {
      throw new Error(await resp.text());
    }

    props.isHiddenSig.value = true;
  }

  if (props.isHiddenSig.value) {
    return <>"gizli"</>;
  }

  return (
    <a href="/qa" onClick={onClick}>
      gizle
    </a>
  );
}

interface QuestionSummaryProps {
  question: Question;
  /** Whether the question has been voted-for by the logged-in user */
  isVoted: boolean;
  /** Whether the user is logged-in */
  isLoggedIn: boolean;
  /** Whether the user is an editor */
  isEditor?: boolean;
}

function QuestionSummary(props: QuestionSummaryProps) {
  const scoreSig = useSignal(props.question.score);
  const isVotedSig = useSignal(props.isVoted);
  const isHiddenSig = useSignal(props.question.hidden);

  return (
    <div class="py-2 flex gap-4">
      <div
        class={`pr-2 text-center flex flex-col justify-center ${
          isVotedSig.value ? "text-primary" : "hover:text-primary"
        }`}
      >
        {!props.isLoggedIn && (
          <a
            title="Oylamak için giriş yapın"
            href="/auth/login"
          >
            ▲
          </a>
        )}
        {props.isLoggedIn && (
          <VoteButton
            question={props.question}
            scoreSig={scoreSig}
            isVotedSig={isVotedSig}
          />
        )}
        <p>{scoreSig}</p>
      </div>
      <div class="space-y-1">
        <p>
          {props.question.question}
        </p>
        <p class="text-slate-500">
          <GitHubAvatarImg
            login={props.question.userLogin}
            size={24}
            class="mr-2"
          />
          <a
            class="hover:underline"
            href={`/users/${props.question.userLogin}`}
          >
            {props.question.userLogin}
          </a>
          {" - "}
          {timeAgo(new Date(decodeTime(props.question.id)))}
          {props.isEditor === true
            ? (
              <>
                {" - "}
                <HideLink question={props.question} isHiddenSig={isHiddenSig} />
              </>
            )
            : null}
        </p>
      </div>
    </div>
  );
}

export interface QuestionsListProps {
  /** Endpoint URL of the REST API to make the fetch request to */
  endpoint: string;
  /** Whether the user is logged-in */
  isLoggedIn: boolean;
  /** Whether the user is an editor */
  isEditor?: boolean;
}

export default function QuestionsList(props: QuestionsListProps) {
  const questionsSig = useSignal<Question[]>([]);
  const votedQuestionsIdsSig = useSignal<string[]>([]);
  const cursorSig = useSignal("");
  const isLoadingSig = useSignal<boolean | undefined>(undefined);
  const questionsAreVotedSig = useComputed(() =>
    questionsSig.value.map((question) =>
      votedQuestionsIdsSig.value.includes(question.id)
    )
  );

  async function loadMoreQuestions() {
    if (isLoadingSig.value) {
      return;
    }

    isLoadingSig.value = true;

    try {
      const { values, cursor } = await fetchValues<Question>(
        props.endpoint,
        cursorSig.value,
      );

      questionsSig.value = [...questionsSig.value, ...values];
      cursorSig.value = cursor;
    } catch (error) {
      console.error(error.message);
    } finally {
      isLoadingSig.value = false;
    }
  }

  useEffect(() => {
    if (!props.isLoggedIn) {
      loadMoreQuestions();
      return;
    }

    fetchVotedQuestions()
      .then((votedQuestions) =>
        votedQuestionsIdsSig.value = votedQuestions.map(({ id }) => id)
      )
      .finally(() => loadMoreQuestions());
  }, []);

  if (isLoadingSig.value === undefined) {
    return <p class={LINK_STYLES}>Yükleniyor...</p>;
  }

  return (
    <div>
      {questionsSig.value.length
        ? questionsSig.value.map((question, id) => {
          return (
            <QuestionSummary
              key={question.id}
              question={question}
              isVoted={questionsAreVotedSig.value[id]}
              isLoggedIn={props.isLoggedIn}
              isEditor={props.isEditor}
            />
          );
        })
        : <EmptyQuestionsList />}
      {cursorSig.value !== "" && (
        <button onClick={loadMoreQuestions} class={LINK_STYLES}>
          {isLoadingSig.value ? "Yükleniyor..." : "Daha fazla göster"}
        </button>
      )}

      <div class="my-10 flex flex-row gap-6 justify-center">
        <a
          href="/qa/ask"
          class="flex flex-row gap-2 text-center text-white rounded-lg bg-secondary px-4 py-2"
        >
          <IconMessageCircleQuestion class="h-6 w-6" />
          Soru sor &#8250;
        </a>
      </div>
    </div>
  );
}

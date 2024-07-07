// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as datetime from "@std/datetime";
import { Signal, useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import IconInfo from "tabler_icons_tsx/info-circle.tsx";
import IconMessageCircleQuestion from "tabler_icons_tsx/message-circle-question.tsx";
import { UserProfilePicture } from "@/pkg/main/routes/(common)/(_components)/user-profile-picture.tsx";
import { UserProfileLink } from "@/pkg/main/routes/(common)/(_components)/user-profile-link.tsx";
import { questionRepository } from "@/pkg/main/data/repositories/questions.ts";
import { timeAgo } from "@/pkg/main/library/display/time-ago.ts";

type Question = Awaited<
  ReturnType<typeof questionRepository.findAllWithScores>
>[0];

const fetchVotedQuestions = async () => {
  const url = "/api/me/question-votes";
  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`Request failed: GET ${url}`);
  }

  return await resp.json() as { items: Question[]; cursor: string };
};

const EmptyQuestionsList = () => {
  return (
    <div class="flex flex-col justify-center items-center gap-2 pt-16">
      <IconInfo class="w-10 h-10 text-slate-400 dark:text-slate-600" />
      <p>Henüz herhangi bir soru sorulmamış</p>
    </div>
  );
};

interface VoteButtonProps {
  question: Question;
  scoreSig: Signal<number>;
  isLoggedIn: boolean;
  isVotedSig: Signal<boolean>;
}

const VoteButton = (props: VoteButtonProps) => {
  const onClick = async (event: MouseEvent) => {
    if (event.detail !== 1) {
      return;
    }

    const resp = await fetch(
      `/api/questions/vote?questionId=${props.question.id}`,
      {
        method: "POST",
      },
    );

    if (!resp.ok) {
      throw new Error(await resp.text());
    }

    props.scoreSig.value++;
    props.isVotedSig.value = true;
  };

  if (!props.isLoggedIn) {
    return (
      <a
        role="button"
        title="log in"
        class="btn btn-sm btn-neutral"
        href="/auth/login"
      >
        ▲
      </a>
    );
  }

  if (props.isVotedSig.value) {
    return (
      <button title="vote up" class="border-0 btn btn-sm btn-primary">
        ▲
      </button>
    );
  }

  return (
    <button
      title="vote up"
      onClick={onClick}
      class="border-0 btn btn-sm btn-primary"
    >
      ▲
    </button>
  );
};

interface HideLinkProps {
  question: Question;
  isHiddenSig: Signal<boolean>;
}

const HideLink = (props: HideLinkProps) => {
  const onClick = async (event: MouseEvent) => {
    event.preventDefault();

    if (event.detail !== 1) {
      return;
    }

    const resp = await fetch(
      `/api/questions/hide?questionId=${props.question.id}`,
      {
        method: "POST",
      },
    );

    if (!resp.ok) {
      throw new Error(await resp.text());
    }

    props.isHiddenSig.value = true;
  };

  if (props.isHiddenSig.value) {
    return <>"gizli"</>;
  }

  return (
    <a href="/qa" onClick={onClick}>
      gizle
    </a>
  );
};

interface QuestionSummaryProps {
  question: Question;
  /** Whether the question has been voted-for by the logged-in user */
  isVoted: boolean;
  /** Whether the user is logged-in */
  isLoggedIn: boolean;
  /** Whether the user is an editor */
  isEditor?: boolean;
}

const QuestionSummary = (props: QuestionSummaryProps) => {
  const scoreSig = useSignal(props.question.scoreSumTotal);
  const isVotedSig = useSignal(props.question.scoreSumUser > 0);
  const isHiddenSig = useSignal(false); // props.question.isHidden

  const date = new Date(props.question.updatedAt ?? props.question.createdAt);

  return (
    <div class="py-2 flex gap-4">
      <div class="pr-2 text-center flex flex-col justify-center">
        <VoteButton
          question={props.question}
          scoreSig={scoreSig}
          isLoggedIn={props.isLoggedIn}
          isVotedSig={isVotedSig}
        />
        <p>{scoreSig.value}</p>
      </div>
      <div class="space-y-1">
        <p>
          {props.question.content}
        </p>
        <p class="text-slate-500">
          <UserProfilePicture
            user={props.question.user ?? undefined}
            isAnonymous={props.question.isAnonymous}
            size={24}
            class="mr-2"
          />
          <UserProfileLink
            user={props.question.user ?? undefined}
            isAnonymous={props.question.isAnonymous}
          />
          {" - "}
          <span title={datetime.format(date, "yyyy-MM-dd HH:mm:ss")}>
            {timeAgo(date)}
          </span>
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
};

export interface QuestionsListProps {
  /** Endpoint URL of the REST API to make the fetch request to */
  endpoint: string;
  /** Whether the user is logged-in */
  isLoggedIn: boolean;
  /** Whether the user is an editor */
  isEditor?: boolean;
}

export const QuestionsList = (props: QuestionsListProps) => {
  const questionsSig = useSignal<Question[]>([]);
  const votedQuestionsIdsSig = useSignal<string[]>([]);
  const isLoadingSig = useSignal<boolean | undefined>(undefined);
  const questionsAreVotedSig = useComputed(() =>
    questionsSig.value.map((question) =>
      votedQuestionsIdsSig.value.includes(question.id)
    )
  );

  const loadMoreQuestions = async () => {
    if (isLoadingSig.value) {
      return;
    }

    isLoadingSig.value = true;

    try {
      const resp = await fetch(props.endpoint);
      if (!resp.ok) {
        throw new Error(`Request failed: GET ${props.endpoint}`);
      }

      const result = await resp.json();

      questionsSig.value = [
        ...questionsSig.value,
        ...result.items,
      ];
    } catch (error) {
      console.error(error.message);
    } finally {
      isLoadingSig.value = false;
    }
  };

  useEffect(() => {
    if (!props.isLoggedIn) {
      loadMoreQuestions();
      return;
    }

    fetchVotedQuestions()
      .then((votedQuestions) => {
        votedQuestionsIdsSig.value = votedQuestions.items.map(({ id }) => id);
      })
      .finally(() => loadMoreQuestions());
  }, []);

  if (isLoadingSig.value === undefined) {
    return (
      <p class="text-slate-500 transition duration-100 hover:text-black hover:dark:text-white">
        Yükleniyor...
      </p>
    );
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
      {isLoadingSig.value && (
        <p class="transition duration-100">
          Yükleniyor...
        </p>
      )}

      <div class="my-10 flex flex-row gap-6 justify-center">
        <a
          href="/qa/ask"
          class="btn btn-wide btn-primary"
        >
          <IconMessageCircleQuestion class="h-6 w-6" />
          Soru sor &#8250;
        </a>
      </div>
    </div>
  );
};

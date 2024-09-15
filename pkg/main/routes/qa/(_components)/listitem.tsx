// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as datetime from "@std/datetime";
import { useSignal } from "@preact/signals";
import { timeDiff } from "@/pkg/main/library/display/time-diff.ts";
import { UserProfileLink } from "@/pkg/main/routes/(common)/(_components)/user-profile-link.tsx";
import { UserProfilePicture } from "@/pkg/main/routes/(common)/(_components)/user-profile-picture.tsx";
import type { QuestionWithScores } from "@/pkg/main/data/question/types.ts";
import { VoteButton } from "../(_islands)/listitem-vote.tsx";
import { HideLink } from "../(_islands)/listitem-hide.tsx";

export type QuestionListItemProps = {
  question: QuestionWithScores;
  isLoggedIn: boolean;
  isEditor: boolean;
};

export function QuestionListItem(props: QuestionListItemProps) {
  const scoreSig = useSignal(props.question.scoreSumTotal);
  const isVotedSig = useSignal(props.question.scoreSumUser > 0);
  const isHiddenSig = useSignal(false); // props.question.isHidden

  const date = new Date(props.question.updatedAt ?? props.question.createdAt);
  const dateAnswered = new Date(props.question.answeredAt ?? 0);

  return (
    <div class="pb-12 flex items-start gap-4">
      <div class="flex-none pr-2 text-center flex flex-col justify-center">
        <VoteButton
          question={props.question}
          scoreSig={scoreSig}
          isLoggedIn={props.isLoggedIn}
          isVotedSig={isVotedSig}
        />
        <p>{scoreSig.value}</p>
      </div>
      <div class="flex-1 indicator flex flex-col">
        {props.question.answeredAt !== null
          ? <div class="indicator-item badge badge-outline badge-lg badge-success">✔︎</div>
          : null}
        <p class="m-0">{props.question.content}</p>
        <p class="text-secondary-content flex items-center gap-2">
          <UserProfilePicture user={props.question.user} isAnonymous={props.question.isAnonymous} size={24} />
          <UserProfileLink user={props.question.user} isAnonymous={props.question.isAnonymous} />
          <span>-</span>
          <span title={datetime.format(date, "yyyy-MM-dd HH:mm:ss")}>{timeDiff(date)}</span>
          {props.isEditor === true
            ? (
              <>
                <span>-</span>
                <HideLink question={props.question} isHiddenSig={isHiddenSig} />
              </>
            )
            : null}
        </p>
        {props.question.answeredAt !== null
          ? (
            <div class="answer bg-secondary glass rounded p-5 pb-0">
              <p class="m-0">{props.question.answerContent}</p>
              <p class="text-secondary-content flex items-center gap-2">
                <span title={datetime.format(dateAnswered, "yyyy-MM-dd HH:mm:ss")}>{timeDiff(dateAnswered)}</span>
              </p>
            </div>
          )
          : null}
      </div>
    </div>
  );
}

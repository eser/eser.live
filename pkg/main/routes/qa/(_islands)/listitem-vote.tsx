// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Signal } from "@preact/signals";
import type { QuestionWithScores } from "@/pkg/main/data/question/types.ts";

export type VoteButtonProps = {
  question: QuestionWithScores;
  scoreSig: Signal<number>;
  isLoggedIn: boolean;
  isVotedSig: Signal<boolean>;
};

export const VoteButton = (props: VoteButtonProps) => {
  const onClick = async (event: MouseEvent) => {
    if (event.detail !== 1) {
      return;
    }

    const resp = await fetch(`/qa/${props.question.id}/vote`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });

    if (!resp.ok) {
      throw new Error(await resp.text());
    }

    props.scoreSig.value++;
    props.isVotedSig.value = true;
  };

  if (!props.isLoggedIn) {
    return (
      <a role="button" title="log in" class="btn btn-sm btn-neutral" href="/auth/login">
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
    <button title="vote up" onClick={onClick} class="border-0 btn btn-sm btn-primary">
      ▲
    </button>
  );
};

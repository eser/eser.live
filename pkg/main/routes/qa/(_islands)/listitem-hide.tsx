// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Signal } from "@preact/signals";
import type { QuestionWithScores } from "@/pkg/main/data/question/types.ts";

export type HideLinkProps = {
  question: QuestionWithScores;
  isHiddenSig: Signal<boolean>;
};

export const HideLink = (props: HideLinkProps) => {
  const onClick = async (event: MouseEvent) => {
    event.preventDefault();

    if (event.detail !== 1) {
      return;
    }

    const resp = await fetch(`/qa/${props.question.id}/hide`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });

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

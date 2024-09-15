// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
// import { type Signal, useComputed, useSignal } from "@preact/signals";
import { InfiniteScrollerList } from "@/pkg/main/routes/(common)/(_islands)/infinite-scroller-list.tsx";
import { QuestionListItem } from "../(_components)/listitem.tsx";

type QuestionListProps<TItem, TCursor> = {
  initialItems: TItem[];
  initialNextCursor: TCursor | null;
  baseUri: string;
  isLoggedIn: boolean;
  isEditor: boolean;
};

export function QuestionList<TItem, TCursor>(props: QuestionListProps<TItem, TCursor>) {
  // const votedQuestionsIdsSig = useSignal<string[]>([]);
  // const questionsAreVotedSig = useComputed(() =>
  //   props.initialItems.map((item) => votedQuestionsIdsSig.value.includes(item.id))
  // );

  // useEffect(() => {
  //   fetchVotedQuestions() //   const url = "/api/me/question-votes";
  //     .then((votedQuestions) => {
  //       votedQuestionsIdsSig.value = votedQuestions.items.map(({ id }) => id);
  //     });
  // }, []);

  return (
    <InfiniteScrollerList
      initialItems={props.initialItems}
      initialNextCursor={props.initialNextCursor}
      baseUri={props.baseUri}
      itemRenderer={(item) => (
        <QuestionListItem
          key={item.id}
          question={item}
          isVoted={false}
          isLoggedIn={props.isLoggedIn}
          isEditor={props.isEditor}
        />
      )}
    />
  );
}

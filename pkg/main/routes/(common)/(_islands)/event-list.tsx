// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as datetime from "@std/datetime";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
// import IconInfo from "tabler_icons_tsx/info-circle.tsx";
import { eventRepository } from "@/pkg/main/data/repositories/events.ts";
import { timeDiff } from "@/pkg/main/library/display/time-diff.ts";

type Event = Awaited<
  ReturnType<typeof eventRepository.findAllWithStats>
>[0];

// const fetchMarkedEvents = async () => {
//   const url = "/api/me/event-attendances";
//   const resp = await fetch(url);

//   if (!resp.ok) {
//     throw new Error(`Request failed: GET ${url}`);
//   }

//   return await resp.json() as { items: Event[]; cursor: string };
// };

const EventsListEmpty = () => {
  return (
    <>
      {/* <IconInfo class="w-10 h-10 text-slate-400 dark:text-slate-600" /> */}
      <p>
        Şu anda planlanmış etkinlik bulunmamaktadır. Anlık yayın ve etkinlik
        bildirimleri için Telegram üzerinden{" "}
        <em>
          <a href="https://t.me/eserlive">
            eser.live ve yazılımcı ağı telegram duyuru kanalı
          </a>
        </em>nı takip edebilirsiniz.
      </p>
    </>
  );
};

// interface MarkButtonProps {
//   event: Event;
//   statSig: Signal<number>;
//   isLoggedIn: boolean;
//   isMarkedSig: Signal<boolean>;
// }

// const MarkButton = (props: MarkButtonProps) => {
//   const onClick = async (event: MouseEvent) => {
//     if (event.detail !== 1) {
//       return;
//     }

//     const resp = await fetch(
//       `/api/events/mark?eventId=${props.event.id}`,
//       {
//         method: "POST",
//       },
//     );

//     if (!resp.ok) {
//       throw new Error(await resp.text());
//     }

//     props.statSig.value++;
//     props.isMarkedSig.value = true;
//   };

//   if (!props.isLoggedIn) {
//     return (
//       <a
//         role="button"
//         title="log in"
//         class="btn btn-sm btn-neutral"
//         href="/auth/login"
//       >
//         ▲
//       </a>
//     );
//   }

//   if (props.isMarkedSig.value) {
//     return (
//       <button title="mark" class="border-0 btn btn-sm btn-primary">
//         ▲
//       </button>
//     );
//   }

//   return (
//     <button
//       title="mark"
//       onClick={onClick}
//       class="border-0 btn btn-sm btn-primary"
//     >
//       ▲
//     </button>
//   );
// };

// interface HideLinkProps {
//   event: Event;
//   isHiddenSig: Signal<boolean>;
// }

// const HideLink = (props: HideLinkProps) => {
//   const onClick = async (event: MouseEvent) => {
//     event.preventDefault();

//     if (event.detail !== 1) {
//       return;
//     }

//     const resp = await fetch(
//       `/api/events/hide?eventId=${props.event.id}`,
//       {
//         method: "POST",
//       },
//     );

//     if (!resp.ok) {
//       throw new Error(await resp.text());
//     }

//     props.isHiddenSig.value = true;
//   };

//   if (props.isHiddenSig.value) {
//     return <>"gizli"</>;
//   }

//   return (
//     <a href="/qa" onClick={onClick}>
//       gizle
//     </a>
//   );
// };

interface EventSummaryProps {
  event: Event;
  /** Whether the event has been marked by the logged-in user */
  isMarked: boolean;
  /** Whether the user is logged-in */
  isLoggedIn: boolean;
  /** Whether the user is an editor */
  isEditor?: boolean;
  align: "left" | "right";
}

const EventSummary = (props: EventSummaryProps) => {
  // const statSig = useSignal(props.event.statSumTotal);
  // const isMarkedSig = useSignal(props.event.statSumProfile > 0);
  // const isHiddenSig = useSignal(false); // props.event.isHidden

  const timeStart = new Date(props.event.timeStart);

  return (
    <li>
      <div class="timeline-middle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {
        /* <div class="pr-2 text-center flex flex-col justify-center">
        <MarkButton
          event={props.event}
          statSig={statSig}
          isLoggedIn={props.isLoggedIn}
          isMarkedSig={isMarkedSig}
        />
        <p>{statSig.value}</p>
      </div> */
      }
      <div
        class={`mb-10 ${
          props.align === "left" ? "timeline-start md:text-end" : "timeline-end"
        }`}
      >
        <time
          class="text-slate-500 font-mono italic"
          title={datetime.format(timeStart, "yyyy-MM-dd HH:mm:ss")}
        >
          {timeDiff(timeStart)}
        </time>
        <h3>{props.event.title}</h3>
        <p>{props.event.description}</p>
        {props.event.attendanceUri && (
          <p>
            <a
              class="btn btn-sm btn-primary"
              href={props.event.attendanceUri ?? undefined}
            >
              Etkinliğe Git
            </a>
          </p>
        )}
      </div>
      <hr />
    </li>
  );
};

export interface EventsListProps {
  /** Endpoint URL of the REST API to make the fetch request to */
  endpoint: string;
  /** Whether the user is logged-in */
  isLoggedIn: boolean;
  /** Whether the user is an editor */
  isEditor?: boolean;
}

export const EventsList = (props: EventsListProps) => {
  const eventsSig = useSignal<Event[]>([]);
  // const markedEventsIdsSig = useSignal<string[]>([]);
  const isLoadingSig = useSignal<boolean | undefined>(undefined);
  // const eventsAreMarkedSig = useComputed(() =>
  //   eventsSig.value.map((event) => markedEventsIdsSig.value.includes(event.id))
  // );

  const loadMoreEvents = async () => {
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

      eventsSig.value = [
        ...eventsSig.value,
        ...result.items,
      ];
    } catch (error) {
      console.error(error.message);
    } finally {
      isLoadingSig.value = false;
    }
  };

  useEffect(() => {
    // if (!props.isLoggedIn) {
    loadMoreEvents();
    //   return;
    // }

    // fetchMarkedEvents()
    //   .then((markedEvents) => {
    //     markedEventsIdsSig.value = markedEvents.items.map(({ id }) => id);
    //   })
    //   .finally(() => loadMoreEvents());
  }, []);

  if (isLoadingSig.value !== false) {
    return (
      <p class="transition duration-100">
        Yükleniyor...
      </p>
    );
  }

  if (eventsSig.value.length === 0) {
    return <EventsListEmpty />;
  }

  let itemIndex = 0;

  return (
    <ul class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
      {eventsSig.value.map((event, _id) => {
        return (
          <EventSummary
            key={event.id}
            event={event}
            // isMarked={eventsAreMarkedSig.value[id]}
            isMarked={false}
            isLoggedIn={props.isLoggedIn}
            isEditor={props.isEditor}
            align={itemIndex++ % 2 === 0 ? "left" : "right"}
          />
        );
      })}
    </ul>
  );
};

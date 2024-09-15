// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { EventWithStats } from "@/pkg/main/data/event/types.ts";
import { timeDiff } from "@/pkg/main/library/display/time-diff.ts";
import * as datetime from "@std/datetime";

const EventsListEmpty = () => {
  return <p>Şu anda planlanmış etkinlik bulunmamaktadır.</p>;
};

interface EventSummaryProps {
  event: EventWithStats;
  align: "left" | "right";
}

const EventSummary = (props: EventSummaryProps) => {
  const timeStart = new Date(props.event.timeStart);

  return (
    <li>
      <div class="timeline-middle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div class={`mb-10 ${props.align === "left" ? "timeline-start md:text-end" : "timeline-end"}`}>
        <time class="text-slate-500 font-mono italic" title={datetime.format(timeStart, "yyyy-MM-dd HH:mm:ss")}>
          {timeDiff(timeStart)}
        </time>
        <h3>{props.event.title}</h3>
        <p>{props.event.description}</p>
        {props.event.attendanceUri && (
          <p>
            <a class="btn btn-sm btn-primary" href={props.event.attendanceUri ?? undefined}>
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
  items: EventWithStats[];
}

export const EventsList = (props: EventsListProps) => {
  if (props.items.length === 0) {
    return <EventsListEmpty />;
  }

  let itemIndex = 0;

  return (
    <ul class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
      {props.items.map((event, _id) => {
        return <EventSummary key={event.id} event={event} align={itemIndex++ % 2 === 0 ? "left" : "right"} />;
      })}
    </ul>
  );
};

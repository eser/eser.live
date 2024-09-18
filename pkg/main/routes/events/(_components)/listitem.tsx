// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { EventWithStats } from "@/pkg/main/data/event/types.ts";
import * as datetime from "@std/datetime";

type EventListItemProps = {
  event: EventWithStats;
};

export function EventListItem(props: EventListItemProps) {
  const timeStart = new Date(props.event.timeStart);
  const timeEnd = new Date(props.event.timeEnd);
  const isPast = timeEnd < new Date();

  return (
    <div class={`card ${isPast ? "bg-base-200" : "bg-base-100"} shadow-xl`}>
      <div class="card-body">
        <h2 class="card-title">
          {props.event.title}
          {isPast && <span class="badge badge-secondary">Geçmiş</span>}
        </h2>
        <p>{props.event.description}</p>
        <p>
          Başlangıç: {datetime.format(timeStart, "yyyy-MM-dd HH:mm:ss")}
          <br />
          Bitiş: {datetime.format(timeEnd, "yyyy-MM-dd HH:mm:ss")}
        </p>
        {/* <p>Katılımcı Sayısı: {props.event.statSumTotal}</p> */}
      </div>
    </div>
  );
}

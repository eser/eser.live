// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { ulid } from "std/ulid/mod.ts";
import { kv } from "./db.ts";

// Event
export interface Event {
  id: string;
  entityId: string;
  slug: string;
  title: string;
}

/** For testing */
export function randomEvent(): Event {
  return {
    id: ulid(),
    entityId: ulid(),
    slug: ulid(),
    title: ulid(),
  };
}

/**
 * Creates a new event in the database. Throws if the event already exists.
 *
 * @example
 * ```ts
 * import { createEvent } from "@/pkg/main/services/events.ts";
 *
 * await createEvent({
 *   id: ulid(),
 *   entityId: "bbb",
 *   slug: "xxx",
 *   title: "yyy",
 * });
 * ```
 */
export async function createEvent(event: Event) {
  const eventsKey = ["events", event.id];
  const eventsBySlugKey = ["events_by_slug", event.slug];
  const eventsOfEntityKey = ["events_of_entity", event.entityId, event.id];

  const atomicOp = kv.atomic()
    .check({ key: eventsKey, versionstamp: null })
    .check({ key: eventsBySlugKey, versionstamp: null })
    .check({ key: eventsOfEntityKey, versionstamp: null })
    .set(eventsKey, event)
    .set(eventsBySlugKey, event)
    .set(eventsOfEntityKey, event);

  const res = await atomicOp.commit();

  if (!res.ok) {
    throw new Error("Failed to create event");
  }
}

/**
 * Creates a event in the database, overwriting any previous data.
 *
 * @example
 * ```ts
 * import { updateEvent } from "@/pkg/main/services/events.ts";
 *
 * await updateEvent({
 *   id: ulid(),
 *   entityId: "bbb",
 *   slug: "xxx",
 *   title: "yyy",
 * });
 * ```
 */
export async function updateEvent(event: Event) {
  const eventsKey = ["events", event.id];
  const eventsBySlugKey = ["events_by_slug", event.slug];
  const eventsOfEntityKey = ["events_of_entity", event.entityId, event.id];

  const atomicOp = kv.atomic()
    .set(eventsKey, event)
    .set(eventsBySlugKey, event)
    .set(eventsOfEntityKey, event);

  const res = await atomicOp.commit();

  if (!res.ok) {
    throw new Error("Failed to update event");
  }
}

/**
 * Deletes the event with the given id from the database.
 *
 * @example
 * ```ts
 * import { deleteEvent } from "@/pkg/main/services/events.ts";
 *
 * await deleteEvent("aaa");
 * ```
 */
export async function deleteEvent(id: string) {
  const event = await kv.get<Event>(["events", id]);

  if (!event.value) {
    throw new Error("Event not found");
  }

  const eventsKey = ["events", event.value.id];
  const eventsBySlugKey = ["events_by_slug", event.value.slug];
  const eventsOfEntityKey = [
    "events_of_entity",
    event.value.entityId,
    event.value.id,
  ];

  const atomicOp = kv.atomic()
    .delete(eventsKey)
    .delete(eventsBySlugKey)
    .delete(eventsOfEntityKey);

  const res = await atomicOp.commit();

  if (!res.ok) {
    throw new Error("Failed to delete event");
  }
}

/**
 * Updates the entity id of a given event in the database.
 *
 * @example
 * ```ts
 * import { updateEventEntity } from "@/pkg/main/services/events.ts";
 *
 * await updateEventEntity({
 *   id: "aaa",
 *   entityId: "bbb",
 *   slug: "xxx",
 *   title: "yyy",
 * }, "ccc");
 * ```
 */
export async function updateEventEntity(event: Event, newEntityId: string) {
  const eventKey = ["events", event.id];
  const eventBySlugKey = ["events_by_slug", event.slug];
  const oldEventOfEntityKey = ["events_of_entity", event.entityId, event.id];
  const newEventOfEntityKey = ["events_of_entity", newEntityId, event.id];
  const newEvent: Event = { ...event, entityId: newEntityId };

  const atomicOp = kv.atomic()
    .set(eventKey, newEvent)
    .set(eventBySlugKey, newEvent)
    .delete(oldEventOfEntityKey)
    .check({ key: newEventOfEntityKey, versionstamp: null })
    .set(newEventOfEntityKey, newEvent);

  const res = await atomicOp.commit();

  if (!res.ok) {
    throw new Error("Failed to update event entity");
  }
}

/**
 * Gets the event with the given id from the database.
 *
 * @example
 * ```ts
 * import { getEvent } from "@/pkg/main/services/events.ts";
 *
 * const event = await getEvent("aaa");
 * event?.id; // Returns "aaa"
 * event?.entityId; // Returns "bbb"
 * event?.slug; // Returns "xxx"
 * event?.title; // Returns "yyy"
 * ```
 */
export async function getEvent(id: string) {
  const res = await kv.get<Event>(["events", id]);

  return res.value;
}

/**
 * Gets the event with the given slug from the database.
 *
 * @example
 * ```ts
 * import { getEventBySlug } from "@/pkg/main/services/events.ts";
 *
 * const event = await getEventBySlug("xxx");
 * event?.id; // Returns "aaa"
 * event?.entityId; // Returns "bbb"
 * event?.slug; // Returns "xxx"
 * event?.title; // Returns "yyy"
 * ```
 */
export async function getEventBySlug(slug: string) {
  const res = await kv.get<Event>(["events_by_slug", slug]);

  return res.value;
}

/**
 * Returns a {@linkcode Deno.KvListIterator} which can be used to iterate over
 * the events in the database.
 *
 * @example
 * ```ts
 * import { listEvents } from "@/pkg/main/services/events.ts";
 *
 * for await (const entry of listEvents()) {
 *   entry.value.id; // Returns "aaa"
 *   entry.value.entityId; // Returns "bbb"
 *   entry.value.slug; // Returns "xxx"
 *   entry.value.title; // Returns "yyy"
 * }
 * ```
 */
export function listEvents(options?: Deno.KvListOptions) {
  return kv.list<Event>({ prefix: ["events"] }, options);
}

/**
 * Returns a {@linkcode Deno.KvListIterator} which can be used to iterate over
 * the events of a given entity from the database.
 *
 * @example
 * ```ts
 * import { listEventsOfEntity } from "@/pkg/main/services/events.ts";
 *
 * for await (const entry of listEventsOfEntity("bbb")) {
 *   entry.value.id; // Returns "aaa"
 *   entry.value.entityId; // Returns "bbb"
 *   entry.value.slug; // Returns "xxx"
 *   entry.value.title; // Returns "yyy"
 * }
 * ```
 */
export function listEventsOfEntity(
  entityId: string,
  options?: Deno.KvListOptions,
) {
  return kv.list<Event>({ prefix: ["events_of_entity", entityId] }, options);
}

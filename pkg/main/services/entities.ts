// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { ulid } from "std/ulid/mod.ts";
import { kv } from "./db.ts";

// Entity
export interface Entity {
  id: string;
  slug: string;
  name: string;
}

/** For testing */
export function randomEntity(): Entity {
  return {
    id: ulid(),
    slug: ulid(),
    name: ulid(),
  };
}

/**
 * Creates a new entity in the database. Throws if the entity already exists.
 *
 * @example
 * ```ts
 * import { createEntity } from "@/pkg/main/services/entities.ts";
 *
 * await createEntity({
 *   id: ulid(),
 *   slug: "eserlive",
 *   name: "eser.live",
 * });
 * ```
 */
export async function createEntity(entity: Entity) {
  const entitiesKey = ["entities", entity.id];
  const entitiesBySlugKey = ["entities_by_slug", entity.slug];

  const atomicOp = kv.atomic()
    .check({ key: entitiesKey, versionstamp: null })
    .check({ key: entitiesBySlugKey, versionstamp: null })
    .set(entitiesKey, entity)
    .set(entitiesBySlugKey, entity);

  const res = await atomicOp.commit();

  if (!res.ok) {
    throw new Error("Failed to create entity");
  }
}

/**
 * Creates an entity in the database, overwriting any previous data.
 *
 * @example
 * ```ts
 * import { updateEntity } from "@/pkg/main/services/entities.ts";
 *
 * await updateEntity({
 *   id: ulid(),
 *   slug: "eserlive",
 *   name: "eser.live",
 * });
 * ```
 */
export async function updateEntity(entity: Entity) {
  const entitiesKey = ["entities", entity.id];
  const entitiesBySlugKey = ["entities_by_slug", entity.slug];

  const atomicOp = kv.atomic()
    .set(entitiesKey, entity)
    .set(entitiesBySlugKey, entity);

  const res = await atomicOp.commit();

  if (!res.ok) {
    throw new Error("Failed to update entity");
  }
}

/**
 * Gets the entity with the given id from the database.
 *
 * @example
 * ```ts
 * import { getEntity } from "@/pkg/main/services/entities.ts";
 *
 * const entity = await getEntity("aaa");
 * entity?.id; // Returns "aaa"
 * entity?.slug; // Returns "eserlive"
 * entity?.name; // Returns "eser.live"
 * ```
 */
export async function getEntity(id: string) {
  const res = await kv.get<Entity>(["entities", id]);

  return res.value;
}

/**
 * Gets the entity with the given slug from the database.
 *
 * @example
 * ```ts
 * import { getEntityBySlug } from "@/pkg/main/services/entities.ts";
 *
 * const entity = await getEntityBySlug("eserlive");
 * entity?.id; // Returns "aaa"
 * entity?.slug; // Returns "eserlive"
 * entity?.name; // Returns "eser.live"
 * ```
 */
export async function getEntityBySlug(slug: string) {
  const res = await kv.get<Entity>(["entities_by_slug", slug]);

  return res.value;
}

/**
 * Returns a {@linkcode Deno.KvListIterator} which can be used to iterate over
 * the entities in the database.
 *
 * @example
 * ```ts
 * import { listEntities } from "@/pkg/main/services/entities.ts";
 *
 * for await (const entry of listEntities()) {
 *   entry.value.id; // Returns "aaa"
 *   entry.value.name; // Returns "eser.live"
 * }
 * ```
 */
export function listEntities(options?: Deno.KvListOptions) {
  return kv.list<Entity>({ prefix: ["entities"] }, options);
}

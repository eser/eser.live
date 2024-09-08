// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { questionVoteSchema } from "./schema.ts";

export type QuestionVote = typeof questionVoteSchema.$inferSelect;
export type QuestionVotePartial = typeof questionVoteSchema.$inferInsert;

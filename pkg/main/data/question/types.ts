// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { userSchema } from "../user/schema.ts";
import { questionSchema } from "./schema.ts";

export type Question = typeof questionSchema.$inferSelect;
export type QuestionPartial = typeof questionSchema.$inferInsert;

export type QuestionWithScores = {
  id: typeof questionSchema.$inferSelect["id"];
  user: {
    id: typeof userSchema.$inferSelect["id"];
    name: typeof userSchema.$inferSelect["name"];
    githubHandle: typeof userSchema.$inferSelect["githubHandle"];
  } | null;
  content: typeof questionSchema.$inferSelect["content"];
  isAnonymous: typeof questionSchema.$inferSelect["isAnonymous"];
  answerKind: typeof questionSchema.$inferSelect["answerKind"];
  answerContent: typeof questionSchema.$inferSelect["answerContent"];
  answerUri: typeof questionSchema.$inferSelect["answerUri"];
  answeredAt: typeof questionSchema.$inferSelect["answeredAt"];
  createdAt: typeof questionSchema.$inferSelect["createdAt"];
  updatedAt: typeof questionSchema.$inferSelect["updatedAt"];
  scoreSumTotal: number;
  scoreSumUser: number;
};

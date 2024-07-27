ALTER TABLE "question" RENAME COLUMN "answered_at_uri" TO "answer_uri";--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "answer_kind" text;--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "answer_content" text;

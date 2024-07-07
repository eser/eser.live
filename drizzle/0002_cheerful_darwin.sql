ALTER TABLE "question" ADD COLUMN "answered_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "answered_at_uri" text;--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "is_anonymous" boolean DEFAULT false NOT NULL;

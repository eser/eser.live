ALTER TABLE "event" ADD COLUMN "status" text NOT NULL DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "attendance_uri" text;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "published_at" timestamp with time zone;

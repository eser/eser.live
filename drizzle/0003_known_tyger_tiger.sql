CREATE TABLE IF NOT EXISTS "event" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"slug" text NOT NULL,
	"event_picture_uri" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"time_start" timestamp with time zone NOT NULL,
	"time_end" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "event_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_attendance" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"event_id" char(26) NOT NULL,
	"profile_id" char(26) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "event_attendance_event_id_profile_id_unique" UNIQUE("event_id","profile_id")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "individual_profile_id" char(26);

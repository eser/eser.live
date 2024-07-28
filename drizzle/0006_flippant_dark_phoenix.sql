CREATE TABLE IF NOT EXISTS "event_series" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"event_picture_uri" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "event_series_slug_unique" UNIQUE("slug")
);

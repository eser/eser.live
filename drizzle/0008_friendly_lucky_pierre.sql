CREATE TABLE IF NOT EXISTS "story" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"status" text NOT NULL,
	"is_featured" boolean DEFAULT false,
	"slug" text NOT NULL,
	"story_picture_uri" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"author_profile_id" char(26),
	"content" text,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "story_slug_unique" UNIQUE("slug")
);

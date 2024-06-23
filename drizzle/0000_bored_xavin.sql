CREATE TABLE IF NOT EXISTS "user" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"github_handle" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_session" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"user" char(26) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"slug" text NOT NULL,
	"profile_picture_uri" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"show_stories" boolean DEFAULT false NOT NULL,
	"show_projects" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "profile_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile_membership" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"profile" char(26) NOT NULL,
	"user" char(26) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "profile_membership_profile_user_unique" UNIQUE("profile","user")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"user" char(26) NOT NULL,
	"content" text NOT NULL,
	"is_hidden" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question_vote" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"question" char(26) NOT NULL,
	"user" char(26) NOT NULL,
	"score" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "question_vote_question_user_unique" UNIQUE("question","user")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_session_user_index" ON "user_session" USING btree ("user");

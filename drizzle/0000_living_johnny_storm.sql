CREATE TABLE IF NOT EXISTS "user" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"github_handle" text,
	"x_handle" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_github_handle_unique" UNIQUE("github_handle")
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
	"deleted_at" timestamp with time zone,
	CONSTRAINT "profile_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile_membership" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"profile_id" char(26) NOT NULL,
	"user_id" char(26) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "profile_membership_profile_id_user_id_unique" UNIQUE("profile_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"oauth_request_state" text NOT NULL,
	"oauth_request_code_verifier" text NOT NULL,
	"oauth_redirect_uri" text,
	"logged_in_user_id" char(26),
	"logged_in_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"user_id" char(26) NOT NULL,
	"content" text NOT NULL,
	"is_hidden" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question_vote" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"question_id" char(26) NOT NULL,
	"user_id" char(26) NOT NULL,
	"score" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "question_vote_question_id_user_id_unique" UNIQUE("question_id","user_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_logged_in_user_id_index" ON "session" USING btree ("logged_in_user_id");

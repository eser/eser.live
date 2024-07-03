ALTER TABLE "user" DROP CONSTRAINT "user_github_handle_unique";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "github_remote_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "x_remote_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_github_remote_id_unique" UNIQUE("github_remote_id");

CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" varchar(256),
	"phone" varchar(256),
	"role" text,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

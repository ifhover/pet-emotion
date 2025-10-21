ALTER TABLE "task" ADD COLUMN "ip" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "gen_limit" integer DEFAULT 5 NOT NULL;
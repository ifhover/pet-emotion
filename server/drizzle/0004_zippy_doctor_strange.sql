ALTER TABLE "task" ALTER COLUMN "result" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "result" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "google_id" text;
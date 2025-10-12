ALTER TABLE "task" ADD COLUMN "status" text NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "error_message" text;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "result" text;
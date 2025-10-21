ALTER TABLE "task" ALTER COLUMN "error_message" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "error_message" DROP NOT NULL;
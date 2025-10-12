ALTER TABLE "task" ALTER COLUMN "error_message" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "error_message" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "result" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "result" SET NOT NULL;
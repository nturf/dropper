CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"size" integer NOT NULL,
	"type" text NOT NULL,
	"fileUrl" text NOT NULL,
	"thumbnailUrl" text,
	"userId" text NOT NULL,
	"parentId" uuid NOT NULL,
	"isFolder" boolean DEFAULT false NOT NULL,
	"isStarred" boolean DEFAULT false NOT NULL,
	"isTrashed" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

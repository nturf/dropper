import { pgTable, integer, text, uuid, varchar, PgTable, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Children } from "react";

export const files = pgTable("files", {

    // files and folder info
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    path: text("path").notNull(),
    size: integer("size").notNull(),
    type: text("type").notNull(),

    // storage info
    fileUrl: text("fileUrl").notNull(),
    thumbnailUrl: text("thumbnailUrl"),

    // ownership
    userId: text("userId").notNull(),
    parentId: uuid("parentId").notNull(),

    // files and folder state
    isFolder: boolean("isFolder").default(false).notNull(),
    isStarred: boolean("isStarred").default(false).notNull(),
    isTrashed: boolean("isTrashed").default(false).notNull(),

    // Timestamps
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),


})

export const fileRelations = relations(files, ({ one, many }) => ({
    parent: one(files, {
        fields: [files.parentId],
        references: [files.id],
    }),

    children: many(files)

}))

export const File = typeof files.$inferSelect
export const newFile = typeof files.$inferInsert

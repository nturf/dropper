import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { files } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Unautorized", status: 401 })
        }

        const body = await request.json()
        const { imagekit, userId: bodyUserId } = body


        if (bodyUserId !== userId) {
            return NextResponse.json({ error: "Unautorized", status: 401 })
        }

        if (!imagekit || !imagekit.url) {
            return NextResponse.json({ error: "Invalid file upload ", status: 401 })
        }

        const fileData: any = {
            name: imagekit.name || "Untitled",
            path: imagekit.filePath || `/droply/${userId}/${imagekit.name}`,
            size: imagekit.size || 0,
            type: imagekit.fileType || "image",
            fileUrl: imagekit.url,
            thumbnailUrl: imagekit.thumbnailUrl || null,
            userId: userId,
            parentId: null, // Root level by default
            isFolder: false,
            isStarred: false,
            isTrash: false,

        }

        const [newFile] = await db.insert(files).values(fileData).returning()
        return NextResponse.json({ newFile })


    } catch (error) {
        console.error("Error while authrizing", error);
        return NextResponse.json({ error: "Error while authorizing", status: 501 })


    }
}


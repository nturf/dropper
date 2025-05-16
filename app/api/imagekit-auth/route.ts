import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Imagekit from "imagekit"


const imagekit = new Imagekit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
})

export async function GET() {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized User" }, { status: 401 })
        }

        const authParams = imagekit.getAuthenticationParameters()
        return NextResponse.json(authParams)

    } catch (error) {
        console.error("Error generating ImageKit auth params:", error);
        return NextResponse.json({
            error: "Failed to generate authentication paramaters for imagkti",
            status: 500
        })

    }
}


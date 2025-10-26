import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Check if request is form data (from share target)
        const contentType = request.headers.get("content-type");

        if (contentType?.includes("multipart/form-data")) {
            // Handle share target from PWA
            const formData = await request.formData();

            const title = formData.get("title") as string;
            const text = formData.get("text") as string;
            const url = formData.get("url") as string;
            const media = formData.get("media") as File;

            console.log("PWA Share Target received:");
            console.log("Title:", title);
            console.log("Text:", text);
            console.log("URL:", url);

            if (media) {
                console.log("Media file:", {
                    name: media.name,
                    type: media.type,
                    size: media.size,
                });
            }

            // In a real app, you would process the shared content here
            // For now, we'll just log it and return a success response

            return NextResponse.json({
                success: true,
                message: "Content received via PWA share target",
                data: {
                    title,
                    text,
                    url,
                    mediaInfo: media ? {
                        name: media.name,
                        type: media.type,
                        size: media.size,
                    } : null,
                },
            });
        } else {
            // Handle regular API calls (from Web Share API)
            const body = await request.json();

            console.log("Web Share API data received:");
            console.log("Title:", body.title);
            console.log("Text:", body.text);
            console.log("URL:", body.url);
            console.log("Files:", body.files);

            return NextResponse.json({
                success: true,
                message: "Content received via Web Share API",
                data: body,
            });
        }
    } catch (error) {
        console.error("Error handling share request:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Error processing shared content",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Share API endpoint is working",
        supportedMethods: ["POST"],
        description: "Send POST requests with shared content to this endpoint",
    });
}
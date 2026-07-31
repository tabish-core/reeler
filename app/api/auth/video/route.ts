import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "12", 10);
        const skip = (page - 1) * limit;

        await connectToDatabase();
        const videos = await Video.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Video.countDocuments();
        const hasMore = skip + videos.length < total;

        return NextResponse.json({ videos, hasMore, total });
    }
     catch (error) {
        return NextResponse.json(
            {error: "Failed to fetch Videos"},
            {status: 500},
        )
    }
}

export async function POST(request: NextRequest){
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json(
        {error: "Unauthorized"},
        {status: 401},
        
    );
        }


        await connectToDatabase()


        const body: IVideo = await request.json()

        if(
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl

        ){
            return NextResponse.json(
        {error: "Missing Required Field"},
        {status: 400}
        
    );
        }

        const videoData = {
            ...body,
            controls: body?.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            },
        };
        const newVideo = await Video.create(videoData)
        return NextResponse.json(newVideo)
    } catch (error) {
        return NextResponse.json(
        {error: "Failed to create a Video"},
        {status: 500}
        );
    }
}
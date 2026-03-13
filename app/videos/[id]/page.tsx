import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import Header from "@/app/components/Header";
import VideoPlayer from "@/app/components/VideoPlayer";
import { notFound } from "next/navigation";

async function getVideo(id: string): Promise<IVideo | null> {
    try {
        await connectToDatabase();
        const video = await Video.findById(id).lean();
        if (!video) return null;
        return JSON.parse(JSON.stringify(video));
    } catch (error) {
        console.error("Failed to fetch video:", error);
        return null;
    }
}

export default async function VideoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const video = await getVideo(id);

    if (!video) {
        notFound();
    }

    return (
        <div>
            <Header />
            <main className="page-content">
                <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                    <VideoPlayer video={video} />

                    <h1 className="page-heading" style={{ marginBottom: "0.5rem" }}>{video.title}</h1>
                    <p className="video-card-desc" style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>
                        {video.description}
                    </p>
                </div>
            </main>
        </div>
    );
}

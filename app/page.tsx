import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import Header from "./components/Header";
import VideoFeed from "./components/VideoFeed";

export const revalidate = 10;

async function getInitialVideos(limit = 12): Promise<{ videos: IVideo[]; hasMore: boolean }> {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }).limit(limit).lean();
    const total = await Video.countDocuments();
    return {
      videos: JSON.parse(JSON.stringify(videos)),
      hasMore: videos.length < total,
    };
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return { videos: [], hasMore: false };
  }
}

export default async function Home() {
  const { videos, hasMore } = await getInitialVideos(12);

  return (
    <div>
      <Header />
      <main className="page-content">
        <h1>Made with ❤️ by Tabish.</h1>
        <br />
        <VideoFeed initialVideos={videos} initialHasMore={hasMore} />
      </main>
    </div>
  );
}

import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import Header from "./components/Header";
import VideoFeed from "./components/VideoFeed";

export const revalidate = 10;

async function getVideos(): Promise<IVideo[]> {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(videos));
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return [];
  }
}

export default async function Home() {
  const videos = await getVideos();

  return (
    <div>
      <Header />
      <main className="page-content">
        <h1 >Made with ❤️ by Tabish.</h1>
        <br />
        <VideoFeed videos={videos} />
      </main>
    </div>
  );
}

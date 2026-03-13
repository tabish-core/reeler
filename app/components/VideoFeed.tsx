import { IVideo } from "@/models/Video";
import Link from "next/link";
import VideoComponent from "./VideoComponent";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  return (
    <div className="video-grid">
      {videos.map((video) => (
        <VideoComponent key={video._id?.toString()} video={video} />
      ))}

      {videos.length === 0 && (
        <div className="empty-state">
          <p>No videos yet, be the first to upload one!</p>
          <Link href="/upload" style={{ color: "var(--accent)", marginTop: "0.5rem", display: "inline-block", fontSize: "0.875rem" }}>
            Upload a video →
          </Link>
        </div>
      )}
    </div>
  );
}
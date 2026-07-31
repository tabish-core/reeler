"use client";

import { useState } from "react";
import { IVideo } from "@/models/Video";
import Link from "next/link";
import VideoComponent from "./VideoComponent";

interface VideoFeedProps {
  videos?: IVideo[];
  initialVideos?: IVideo[];
  initialHasMore?: boolean;
}

export default function VideoFeed({ videos: legacyVideos, initialVideos, initialHasMore = false }: VideoFeedProps) {
  const [videos, setVideos] = useState<IVideo[]>(initialVideos || legacyVideos || []);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const loadMoreVideos = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/auth/video?page=${nextPage}&limit=12`);
      if (res.ok) {
        const data = await res.json();
        const newVideos = Array.isArray(data) ? data : (data.videos || []);
        setVideos((prev) => [...prev, ...newVideos]);
        setHasMore(data.hasMore ?? false);
        setPage(nextPage);
      }
    } catch (err) {
      console.error("Error loading more videos:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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

      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <button
            onClick={loadMoreVideos}
            disabled={loading}
            className="btn-primary"
            style={{ maxWidth: "220px", margin: "0 auto", display: "block" }}
          >
            {loading ? "Loading..." : "Load More Videos"}
          </button>
        </div>
      )}
    </div>
  );
}
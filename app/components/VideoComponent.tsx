"use client";

import { IKVideo } from "imagekitio-react";
import Link from "next/link";
import { IVideo } from "@/models/Video";

export default function VideoComponent({ video }: { video: IVideo }) {
  return (
    <div className="video-card">
      <figure style={{ margin: 0 }}>
        <Link href={`/videos/${video._id}`} style={{ display: "block" }}>
          <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
            {video.videoUrl.startsWith('http') ? (
              <IKVideo
                src={video.videoUrl}
                urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                controls={video.controls}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <IKVideo
                path={video.videoUrl}
                urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                controls={video.controls}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            )}
          </div>
        </Link>
      </figure>

      <div className="video-card-body">
        <Link href={`/videos/${video._id}`} style={{ textDecoration: "none" }}>
          <h2 className="video-card-title">{video.title}</h2>
        </Link>
        {video.description && (
          <p className="video-card-desc">{video.description}</p>
        )}
      </div>
    </div>
  );
}
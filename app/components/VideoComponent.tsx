"use client";

import { useState, useRef, useEffect } from "react";
import { IKVideo } from "imagekitio-react";
import Link from "next/link";
import { IVideo } from "@/models/Video";

export default function VideoComponent({ video }: { video: IVideo }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.2, // Trigger when 20% of the video card is visible
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Play/pause based on visibility or hover
  useEffect(() => {
    const el = videoRef.current || containerRef.current?.querySelector<HTMLVideoElement>("video");
    if (!el) return;

    if (isInView || isHovered) {
      el.muted = true;
      el.play().catch((err) => {
        // Autoplay browser policy fallback
        console.debug("Autoplay prevented:", err);
      });
    } else {
      el.pause();
    }
  }, [isInView, isHovered]);

  return (
    <div
      ref={containerRef}
      className="video-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <figure style={{ margin: 0 }}>
        <Link href={`/videos/${video._id}`} style={{ display: "block" }}>
          <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
            {video.videoUrl.startsWith('http') ? (
              <IKVideo
                ref={videoRef}
                src={video.videoUrl}
                poster={video.thumbnailUrl}
                urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                transformation={[{ height: "720", width: "1280" }]}
                controls={video.controls}
                muted
                loop
                playsInline
                preload="metadata"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <IKVideo
                ref={videoRef}
                path={video.videoUrl}
                poster={video.thumbnailUrl}
                urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                transformation={[{ height: "720", width: "1280" }]}
                controls={video.controls}
                muted
                loop
                playsInline
                preload="metadata"
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
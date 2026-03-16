"use client";

import { IKVideo } from "imagekitio-react";
import { IVideo } from "@/models/Video";

interface VideoPlayerProps {
    video: IVideo;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
    return (
        <div style={{ aspectRatio: "16/9", overflow: "hidden", backgroundColor: "#000", marginBottom: "2rem" }}>
            {video.videoUrl.startsWith('http') ? (
                <IKVideo
                    src={video.videoUrl}
                    urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                    controls={video.controls}
                    style={{ width: "100%", height: "100%", display: "block" }}
                />
            ) : (
                <IKVideo
                    path={video.videoUrl}
                    urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                    controls={video.controls}
                    style={{ width: "100%", height: "100%", display: "block" }}
                />
            )}
        </div>
    );
}

"use client";

import Header from "../components/Header";
import VideoUploadForm from "../components/VideoUploadForm";

export default function VideoUploadPage() {
  return (
    <>
      <Header />
      <div className="page-content">
        <div className="max-w-2xl mx-auto">
          <h1 className="page-heading">Upload New Reel</h1>
          <VideoUploadForm />
        </div>
      </div>
    </>
  );
}
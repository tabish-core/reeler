"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "./Notification";
import { upload, ImageKitAbortError, ImageKitInvalidRequestError, ImageKitServerError, ImageKitUploadNetworkError } from "@imagekit/next";

export default function VideoUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { showNotification } = useNotification();
  const abortControllerRef = useRef(new AbortController());

  const authenticator = async () => {
    const response = await fetch("/api/auth/image-kit-auth");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Authentication request failed: ${errorText}`);
    }
    const data = await response.json();
    return {
      signature: data.authenticationParameters.signature,
      expire: data.authenticationParameters.expire,
      token: data.authenticationParameters.token,
      publicKey: data.publicKey,
    };
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      setError("Please select a video file to upload.");
      return;
    }

    const file = fileInput.files[0];
    if (!file.type.startsWith("video/")) {
      setError("Only video files are allowed.");
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      // 1. Authenticate with ImageKit
      const authParams = await authenticator();
      const { signature, expire, token, publicKey } = authParams;

      // 2. Upload file to ImageKit
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        onProgress: (event) => {
          setProgress(Math.round((event.loaded / event.total) * 100));
        },
        abortSignal: abortControllerRef.current.signal,
      });

      // 3. Save purely to our DB
      // We save the filePath instead of the full URL so that IKVideo can correctly apply transformations using the 'path' prop.
      const videoUrl = uploadResponse.filePath;
      const thumbnailUrl = uploadResponse.thumbnailUrl || (uploadResponse.filePath + "/ik-thumbnail.jpg");

      const payload = {
        title,
        description,
        videoUrl,
        thumbnailUrl,
        controls: true,
      };

      // Notice the route is /api/auth/video in your codebase... wait, let me check that
      const res = await fetch("/api/auth/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save video to database.");
      }

      // Success
      showNotification("Video uploaded successfully!", "success");
      router.push("/");
      router.refresh();

    } catch (err: unknown) {
      if (err instanceof ImageKitAbortError) {
        setError("Upload aborted.");
      } else if (err instanceof Error) {
        setError(err.message || "Something went wrong during upload.");
      } else {
        setError("Failed to complete upload.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-card" onSubmit={handleUpload}>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title"
          disabled={loading}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="tell viewers what this is about"
          disabled={loading}
          rows={4}
          style={{ resize: "vertical" }}
          required
        ></textarea>
      </div>

      <div className="field">
        <label htmlFor="videoFile">Video File</label>
        <input
          id="videoFile"
          type="file"
          accept="video/*"
          ref={fileInputRef}
          disabled={loading}
          style={{ padding: "0.5rem" }}
          required
        />
      </div>

      {error && (
        <div className="form-error" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      {progress > 0 && progress < 100 && (
        <div className="field" style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div style={{ width: "100%", height: "4px", backgroundColor: "var(--bg-secondary)", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", backgroundColor: "var(--accent)", transition: "width 0.2s" }}></div>
          </div>
        </div>
      )}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? (
          <span className="btn-spinner">Uploading</span>
        ) : (
          "Publish Video"
        )}
      </button>
    </form>
  );
}
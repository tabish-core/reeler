"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useNotification } from "./Notification";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    setMenuOpen(false);
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <nav className="reel-navbar">
      {/* Logo */}
      <Link
        href="/"
        className="reel-logo"
      >
        Reeler.
      </Link>

      {/* Actions */}
      <div className="nav-action">
        {mounted && (
          <button
            className="theme-switch"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? "Dark" : "Light"}
            <div className="theme-switch-track">
              <div className="theme-switch-thumb"></div>
            </div>
          </button>
        )}

        {session ? (
          <div className="nav-dropdown-wrapper" ref={menuRef}>
            <button
              className="nav-avatar-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </button>

            <div className={`nav-dropdown-menu ${menuOpen ? "open" : ""}`}>
              <div className="nav-user-info">
                <div className="nav-user-email">{session.user?.email}</div>
              </div>

              <Link
                href="/upload"
                className="nav-menu-item"
                onClick={() => {
                  setMenuOpen(false);
                  showNotification("Upload a new reel", "info");
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                </svg>
                Upload video
              </Link>

              <button className="nav-menu-item danger" onClick={handleSignOut}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link href="/register">
              <button className="nav-btn">Sign up</button>
            </Link>
            <Link href="/login">
              <button className="nav-btn nav-btn-accent">Sign in</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
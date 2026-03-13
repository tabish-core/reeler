'use client';

import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { NotificationProvider } from "./Notification";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider refetchInterval={5 * 60}>
        <ImageKitProvider urlEndpoint={urlEndpoint}>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ImageKitProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
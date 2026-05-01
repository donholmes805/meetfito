"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useParams, useRouter } from "next/navigation";
import { videoService, VideoRoom } from "@/services/videoService";
import { useAuth } from "@/context/AuthContext";

export default function VideoRoomDetailPage() {
  const { id } = useParams();
  const [room, setRoom] = useState<VideoRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchRoom = async () => {
      if (typeof id !== "string") return;
      try {
        const data = await videoService.getRoom(id);
        setRoom(data);
      } catch (error) {
        console.error("Error fetching video room:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-container-lowest">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Meeting Not Found</h1>
          <Button onClick={() => router.push("/video")}>Back to Video Meetups</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Video Container */}
          <div className="lg:col-span-2 w-full aspect-video bg-black rounded-[40px] overflow-hidden shadow-2xl relative border-8 border-surface-container">
            <iframe 
              src={`${room.roomUrl}#config.prejoinPageEnabled=false&userInfo.displayName="${user?.displayName || 'Parent'}"`}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              className="w-full h-full border-none"
            />
          </div>

          {/* Sidebar Info */}
          <div className="w-full lg:w-96 shrink-0 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-outline-variant shadow-sm">
              <h1 className="text-2xl font-extrabold mb-4">{room.title}</h1>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                {room.description}
              </p>
              
              <div className="space-y-4 pt-6 border-t border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">person</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Host</p>
                    <p className="text-sm font-bold">{room.hostName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-xl">event</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Scheduled For</p>
                    <p className="text-sm font-bold">
                      {room.scheduledAt?.toDate?.().toLocaleString() || new Date(room.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">security</span>
                Meeting Safety
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Remember to maintain a professional and family-safe environment. This meeting is powered by Jitsi Open Source.
              </p>
              <Button variant="ghost" className="w-full mt-4 text-xs text-red-500 font-bold hover:bg-red-50">
                Report Inappropriate Behavior
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

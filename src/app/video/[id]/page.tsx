"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useParams, useRouter } from "next/navigation";
import { videoService, VideoRoom } from "@/services/videoService";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthAppShell } from "@/components/layout/AuthAppShell";
import { motion } from "framer-motion";

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
      <ProtectedRoute>
        <AuthAppShell>
          <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-outline">videocam_off</span>
            </div>
            <h1 className="text-3xl font-black mb-4">Meeting Not Found</h1>
            <Button className="rounded-2xl h-14 px-8 font-black" onClick={() => router.push("/video")}>Back to Video Meetups</Button>
          </div>
        </AuthAppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AuthAppShell>
        <div className="w-full pb-20">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Video Container */}
            <div className="flex-grow">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full aspect-video bg-black rounded-[48px] overflow-hidden shadow-2xl relative border-[12px] border-surface-container-low"
              >
                <iframe 
                  src={`${room.roomUrl}#config.prejoinPageEnabled=false&userInfo.displayName="${user?.displayName || 'Parent'}"`}
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                  className="w-full h-full border-none"
                />
              </motion.div>
            </div>

            {/* Sidebar Info */}
            <div className="w-full lg:w-[400px] shrink-0 space-y-8">
              <div className="bg-white p-10 rounded-[48px] border border-outline-variant shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <span className="material-symbols-outlined text-[100px] font-black">videocam</span>
                </div>
                
                <h1 className="text-3xl font-black mb-6 leading-tight text-on-surface relative z-10">{room.title}</h1>
                <p className="text-on-surface-variant text-base mb-10 font-medium leading-relaxed relative z-10">
                  {room.description}
                </p>
                
                <div className="space-y-6 pt-8 border-t border-outline-variant/30 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/5">
                      <span className="material-symbols-outlined text-primary text-2xl">person</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-0.5 opacity-60">Meeting Host</p>
                      <p className="text-base font-black text-on-surface">{room.hostName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/5">
                      <span className="material-symbols-outlined text-secondary text-2xl">event</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-0.5 opacity-60">Scheduled For</p>
                      <p className="text-base font-black text-on-surface">
                        {room.scheduledAt?.toDate?.().toLocaleString() || new Date(room.scheduledAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-[40px] border-2 border-outline-variant/50">
                <h3 className="font-black text-on-surface mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">security</span>
                  </span>
                  Meeting Safety
                </h3>
                <p className="text-xs text-on-surface-variant font-bold leading-relaxed">
                  Remember to maintain a professional and family-safe environment. 
                  <span className="block mt-2 opacity-60 italic">Powered by Jitsi Open Source.</span>
                </p>
                <Button variant="ghost" className="w-full mt-8 rounded-xl text-xs text-red-500 font-black uppercase tracking-widest hover:bg-red-50 h-12">
                  Report Incident
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AuthAppShell>
    </ProtectedRoute>
  );
}

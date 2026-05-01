"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { videoService, VideoRoom } from "@/services/videoService";
import { useAuth } from "@/context/AuthContext";
import { canCreateVideoRoom } from "@/lib/auth/rbac";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthAppShell } from "@/components/layout/AuthAppShell";

export default function VideoMeetupsPage() {
  const [rooms, setRooms] = useState<VideoRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await videoService.getAllRooms();
        setRooms(data);
      } catch (error) {
        console.error("Failed to fetch video rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <ProtectedRoute>
      <AuthAppShell>
        <div className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-black mb-4 tracking-tight">Video Meetups</h1>
              <p className="text-on-surface-variant text-lg font-medium leading-relaxed">
                Planning sessions, co-op coordination, and parent introductions. Connect face-to-face from home.
              </p>
            </div>
            {canCreateVideoRoom(profile) && (
              <Button asChild className="rounded-3xl h-16 px-10 shadow-xl shadow-primary/20 text-lg font-black">
                <Link href="/video/create">
                  <span className="material-symbols-outlined mr-2 font-black">video_call</span>
                  Create Room
                </Link>
              </Button>
            )}
          </div>

          <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/10 mb-12 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-primary text-3xl">info</span>
            </div>
            <p className="text-sm text-on-surface-variant font-bold leading-relaxed">
              <strong className="text-primary uppercase tracking-widest text-[10px] block mb-1">Safety Note</strong>
              Parent video meetups are for adults to coordinate and connect. Please ensure your environment is safe and professional.
            </p>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-on-surface-variant font-black font-bold">Loading meetups...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="py-24 bg-white rounded-[64px] border-2 border-dashed border-outline-variant text-center px-6">
              <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-5xl text-outline">videocam_off</span>
              </div>
              <h3 className="text-3xl font-black mb-4">No Scheduled Meetups</h3>
              <p className="text-on-surface-variant max-w-sm mx-auto mb-10 font-medium leading-relaxed text-lg">
                There aren't any video meetups scheduled right now. Check back later or start your own!
              </p>
              {canCreateVideoRoom(profile) && (
                <Button asChild variant="secondary" className="rounded-2xl px-10 h-14 font-black shadow-lg shadow-secondary/10">
                  <Link href="/video/create">Create a Video Room</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {rooms.map((room) => (
                <motion.div 
                  key={room.id}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-[48px] overflow-hidden border border-outline-variant shadow-sm hover:shadow-2xl transition-all flex flex-col h-full group hover:border-primary/20"
                >
                  <div className="p-8 flex-grow">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/5">
                        <span className="material-symbols-outlined text-primary text-4xl">videocam</span>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[9px] font-black px-4 py-2 bg-surface-container rounded-xl uppercase tracking-widest text-on-surface-variant border border-outline-variant/30">
                          {room.status}
                        </span>
                        <span className="text-[8px] font-black text-primary/40 uppercase tracking-widest">
                          via {room.provider}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors leading-tight">{room.title}</h3>
                    <p className="text-on-surface-variant text-sm mb-8 flex-grow font-medium leading-relaxed line-clamp-3">
                      {room.description}
                    </p>
                    
                    <div className="space-y-4 mb-8 bg-surface-container/30 p-5 rounded-3xl border border-outline-variant/30">
                      <div className="flex items-center gap-3 text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary text-xl">calendar_today</span>
                        <span className="text-sm font-bold">
                          {room.scheduledAt?.toDate?.().toLocaleString() || new Date(room.scheduledAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant">
                        <span className="material-symbols-outlined text-secondary text-xl">person</span>
                        <span className="text-sm font-bold truncate">Hosted by {room.hostName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-8 pb-8 mt-auto">
                    <Button asChild className="w-full rounded-2xl py-6 font-black text-base shadow-lg shadow-primary/10 transition-all">
                      <Link href={`/video/${room.id}`}>Join Meeting</Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </AuthAppShell>
    </ProtectedRoute>
  );
}

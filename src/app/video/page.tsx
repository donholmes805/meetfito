"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { videoService, VideoRoom } from "@/services/videoService";
import { useAuth } from "@/context/AuthContext";
import { canCreateVideoRoom } from "@/lib/auth/rbac";

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
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold mb-4">Video Meetups</h1>
            <p className="text-on-surface-variant text-lg">
              Planning sessions, co-op coordination, and parent introductions. Connect face-to-face from home.
            </p>
          </div>
          {canCreateVideoRoom(profile) && (
            <Button asChild size="lg" className="h-14 px-8 rounded-2xl shadow-lg shadow-primary/20">
              <Link href="/video/create">
                <span className="material-symbols-outlined mr-2">video_call</span>
                Create Room
              </Link>
            </Button>
          )}
        </div>

        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 mb-12 flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-3xl">info</span>
          <p className="text-sm text-on-surface-variant font-medium">
            <strong>Safety Note:</strong> Parent video meetups are for adults to coordinate and connect. Please ensure your environment is safe and professional.
          </p>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-on-surface-variant font-medium">Loading meetups...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="py-24 bg-white rounded-[48px] border-2 border-dashed border-outline-variant text-center">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">videocam_off</span>
            <h3 className="text-2xl font-bold mb-2">No Scheduled Meetups</h3>
            <p className="text-on-surface-variant max-w-sm mx-auto mb-8">
              There aren't any video meetups scheduled right now. Check back later or start your own!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <motion.div 
                key={room.id}
                whileHover={{ y: -4 }}
                className="bg-white p-8 rounded-[32px] shadow-sm border border-outline-variant flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl">videocam</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold px-3 py-1 bg-surface-container rounded-full uppercase tracking-widest text-on-surface-variant">
                      {room.status}
                    </span>
                    <span className="text-[9px] font-bold text-primary/60 uppercase tracking-tighter">
                      via {room.provider}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{room.title}</h3>
                <p className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">
                  {room.description}
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    {room.scheduledAt?.toDate?.().toLocaleString() || new Date(room.scheduledAt).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    Hosted by {room.hostName}
                  </div>
                </div>
                
                <Button asChild className="w-full font-bold py-4 rounded-xl">
                  <Link href={`/video/${room.id}`}>Join Meeting</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

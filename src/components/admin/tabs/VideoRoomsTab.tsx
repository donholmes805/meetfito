"use client";

import React, { useEffect, useState } from "react";
import { videoService, VideoRoom } from "@/services/videoService";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { auditService } from "@/services/auditService";

export const VideoRoomsTab = () => {
  const { profile: adminProfile } = useAuth();
  const [rooms, setRooms] = useState<VideoRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await videoService.getAllRooms();
      setRooms(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video room? Participants will be disconnected.")) return;
    try {
      await videoService.deleteRoom(id);
      await auditService.logAction({
        actorId: adminProfile?.uid!,
        actorEmail: adminProfile?.email!,
        actorRole: adminProfile?.role!,
        action: "DELETE_VIDEO_ROOM",
        targetType: "video_room",
        targetId: id,
      });
      fetchRooms();
    } catch (e) {
      alert("Failed to delete room.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Video Rooms</h2>
        <Button variant="outline" onClick={fetchRooms} className="rounded-2xl border-2">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-on-surface-variant font-bold">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="col-span-full p-20 bg-white rounded-[40px] border border-outline-variant text-center">
            <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">video_call</span>
            <p className="text-xl font-bold text-on-surface-variant">No active video rooms.</p>
          </div>
        ) : (
          rooms.map((room) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[40px] p-8 border border-outline-variant shadow-sm flex flex-col justify-between overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/20">
                <div className="bg-primary h-full w-1/3 animate-pulse"></div>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl">videocam</span>
                  </div>
                  <button 
                    onClick={() => deleteRoom(room.id!)}
                    className="p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
                <h3 className="text-xl font-black mb-1">{room.title}</h3>
                <p className="text-xs text-on-surface-variant font-black uppercase tracking-[0.2em] mb-6">
                  Hosted by {room.hostName}
                </p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-on-surface-variant">Provider:</span>
                    <span className="text-on-surface uppercase tracking-widest text-[10px] bg-surface-container px-3 py-1 rounded-lg">
                      {room.provider}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-on-surface-variant">Room ID:</span>
                    <span className="text-on-surface text-[10px] font-mono">{room.providerRoomId?.slice(0, 12) || 'N/A'}...</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-on-surface-variant">Created:</span>
                    <span className="text-on-surface">{new Date(room.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button asChild variant="secondary" className="w-full rounded-2xl h-12 shadow-sm">
                  <a href={room.roomUrl} target="_blank" rel="noopener noreferrer">
                    Join as Admin
                  </a>
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

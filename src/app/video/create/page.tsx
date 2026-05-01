"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { videoService } from "@/services/videoService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CreateVideoRoomPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setLoading(true);
    try {
      const idToken = await user.getIdToken();
      const roomId = await videoService.createRoom({
        title,
        description,
        hostId: user.uid,
        hostName: profile.displayName || user.email || "Parent",
        provider: (process.env.NEXT_PUBLIC_VIDEO_PROVIDER as any) || "jitsi",
        scheduledAt: new Date(scheduledAt),
      }, idToken);
      router.push(`/video/${roomId}`);
    } catch (error) {
      console.error("Error creating video room:", error);
      alert("Failed to create video room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-surface-container-lowest">
        <Navbar />
        
        <main className="flex-grow max-w-2xl mx-auto w-full px-6 py-12">
          <h1 className="text-3xl font-extrabold mb-8">Schedule Video Meetup</h1>
          
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] border border-outline-variant shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Meeting Title</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. Science Co-Op Planning"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea 
                required
                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 h-32"
                placeholder="What will you discuss?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Date & Time</label>
              <input 
                type="datetime-local" 
                required
                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl text-lg font-bold">
              {loading ? "Scheduling..." : "Schedule Meetup"}
            </Button>
          </form>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}

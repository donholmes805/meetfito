"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { videoService } from "@/services/videoService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthAppShell } from "@/components/layout/AuthAppShell";
import { motion } from "framer-motion";

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
      <AuthAppShell>
        <div className="max-w-2xl mx-auto w-full pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 text-primary mb-4">
              <span className="material-symbols-outlined font-black">video_call</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Video Scheduler</span>
            </div>
            <h1 className="text-4xl font-black mb-4 tracking-tighter leading-tight">Schedule Video Meetup</h1>
            <p className="text-on-surface-variant text-lg font-medium leading-relaxed">
              Connect with other parents face-to-face for planning and introductions.
            </p>
          </motion.div>
          
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-14 rounded-[56px] border border-outline-variant shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary opacity-20" />
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 px-1">Meeting Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-6 py-5 bg-surface-container/30 border-2 border-outline-variant/30 rounded-3xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg"
                  placeholder="e.g. Science Co-Op Planning"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 px-1">Description</label>
                <textarea 
                  required
                  className="w-full px-6 py-5 bg-surface-container/30 border-2 border-outline-variant/30 rounded-3xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold leading-relaxed h-40"
                  placeholder="What will you discuss? Who is this meeting for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 px-1">Date & Time</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 opacity-50">calendar_month</span>
                  <input 
                    type="datetime-local" 
                    required
                    className="w-full pl-14 pr-6 py-5 bg-surface-container/30 border-2 border-outline-variant/30 rounded-3xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 h-16 rounded-2xl font-black text-lg border-2 hover:bg-surface-container transition-all"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 h-16 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Scheduling...
                  </div>
                ) : "Schedule Meetup"}
              </Button>
            </div>
          </form>
          
          <div className="mt-10 p-6 bg-surface-container/50 rounded-3xl border border-outline-variant/30 flex items-center gap-4">
            <span className="material-symbols-outlined text-primary">security</span>
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
              Video rooms are private and only accessible to authenticated Meet Fito parents. Please maintain a safe and respectful environment.
            </p>
          </div>
        </div>
      </AuthAppShell>
    </ProtectedRoute>
  );
}

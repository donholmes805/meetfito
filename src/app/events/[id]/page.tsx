"use client";

import React, { useEffect, useState } from "react";
import { eventService, FitoEvent } from "@/services/eventService";
import { Button } from "@/components/ui/Button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthAppShell } from "@/components/layout/AuthAppShell";
import { motion } from "framer-motion";

export default function EventDetailPage({ params }: any) {
  const [event, setEvent] = useState<FitoEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.getEventById(params.id);
        setEvent(data);
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute>
        <AuthAppShell>
          <div className="flex-grow flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl text-outline">event_busy</span>
              </div>
              <h1 className="text-4xl font-black mb-4">Event Not Found</h1>
              <Button asChild className="rounded-2xl h-14 px-8 font-black shadow-lg">
                <a href="/events">Back to Events</a>
              </Button>
            </div>
          </div>
        </AuthAppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AuthAppShell>
        <div className="max-w-4xl mx-auto w-full pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[56px] overflow-hidden border border-outline-variant shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-primary via-secondary to-primary" />
            
            <div className="p-10 md:p-16">
              <div className="flex flex-wrap gap-4 mb-10">
                <span className="px-5 py-2 bg-primary/10 text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                  {event.type.replace('_', ' ')}
                </span>
                {event.boosted && (
                  <span className="px-5 py-2 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-[14px] font-black">rocket_launch</span>
                    Featured Meetup
                  </span>
                )}
              </div>

              <h1 className="text-5xl font-black mb-10 tracking-tighter leading-[1.1] text-on-surface">{event.title}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 p-8 bg-surface-container/30 rounded-[40px] border border-outline-variant/30">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-outline-variant/20">
                    <span className="material-symbols-outlined text-primary text-2xl">calendar_today</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-0.5 opacity-60">Date & Time</p>
                    <p className="font-black text-on-surface">{typeof event.date === 'string' ? event.date : (event.date as any)?.toDate?.().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-outline-variant/20">
                    <span className="material-symbols-outlined text-secondary text-2xl">location_on</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-0.5 opacity-60">Location</p>
                    <p className="font-black text-on-surface">{event.city}, {event.state}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-outline-variant/20">
                    <span className="material-symbols-outlined text-primary text-2xl fill-1">verified</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-0.5 opacity-60">Hosted By</p>
                    <p className="font-black text-on-surface truncate">{event.hostName}</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none mb-12">
                <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">description</span>
                  About this meetup
                </h3>
                <p className="text-on-surface-variant leading-relaxed text-lg font-medium">
                  {event.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-outline-variant/50">
                <Button className="h-20 px-12 rounded-3xl text-xl font-black shadow-2xl shadow-primary/30 flex-grow sm:flex-grow-0 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Join this Meetup
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 px-10 rounded-3xl font-black text-lg border-2 flex items-center gap-3 transition-all hover:bg-primary/5 hover:border-primary/30"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }}
                >
                  <span className="material-symbols-outlined text-2xl">share</span>
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </AuthAppShell>
    </ProtectedRoute>
  );
}

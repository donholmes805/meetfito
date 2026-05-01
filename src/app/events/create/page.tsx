"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { eventService } from "@/services/eventService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthAppShell } from "@/components/layout/AuthAppShell";
import { motion } from "framer-motion";

export default function CreateEventPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "Park Day",
    description: "",
    date: "",
    startTime: "",
    location: "",
    ageRange: "All Ages",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    setLoading(true);
    try {
      await eventService.createEvent({
        title: formData.title,
        type: formData.type.toLowerCase().replace(' ', '_') as any,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,
        endTime: "", // Optional for now
        locationName: formData.location,
        address: formData.location,
        city: profile.city || "Local",
        state: profile.state || "Area",
        lat: 0,
        lng: 0,
        ageMin: parseInt(formData.ageRange.split('-')[0]) || 0,
        ageMax: parseInt(formData.ageRange.split('-')[1]) || 18,
        maxAttendees: 50,
        approvalRequired: true,
        safetyNotes: "",
        status: "active",
        hostId: user.uid,
        hostName: user.displayName || "Parent",
        hostVerified: profile.verifiedParent || false,
        attendees: [user.uid],
      });
      router.push("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <AuthAppShell>
        <div className="max-w-3xl mx-auto w-full pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 text-primary mb-4">
              <span className="material-symbols-outlined font-black">add_circle</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Event Creator</span>
            </div>
            <h1 className="text-4xl font-black mb-4 tracking-tighter leading-tight">Create a Meetup</h1>
            <p className="text-on-surface-variant text-lg font-medium leading-relaxed">Organize a new homeschool gathering and build your local community.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-10 bg-white p-8 md:p-14 rounded-[56px] border border-outline-variant shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-0" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 px-1">Event Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Science Day at the Park"
                  className="w-full px-6 py-5 bg-surface-container/30 border-2 border-outline-variant/30 rounded-3xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 px-1">Event Type</label>
                <div className="relative">
                  <select 
                    className="w-full px-6 py-5 bg-surface-container/30 border-2 border-outline-variant/30 rounded-3xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold appearance-none"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option>Park Day</option>
                    <option>Study Group</option>
                    <option>Field Trip</option>
                    <option>Co-Op Meeting</option>
                    <option>P.E. Session</option>
                    <option>Social Hangout</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">expand_more</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 px-1">Age Range</label>
                <div className="relative">
                  <select 
                    className="w-full px-6 py-5 bg-surface-container/30 border-2 border-outline-variant/30 rounded-3xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold appearance-none"
                    value={formData.ageRange}
                    onChange={(e) => setFormData({...formData, ageRange: e.target.value})}
                  >
                    <option>All Ages</option>
                    <option>Toddlers (0-3)</option>
                    <option>Preschool (3-5)</option>
                    <option>Early Elementary (6-8)</option>
                    <option>Late Elementary (9-11)</option>
                    <option>Middle School (12-14)</option>
                    <option>High School (15-18)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">expand_more</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 px-1">Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-6 py-5 bg-surface-container/30 border-2 border-outline-variant/30 rounded-3xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 px-1">Start Time</label>
                <input 
                  type="time" 
                  required
                  className="w-full px-6 py-5 bg-surface-container/30 border-2 border-outline-variant/30 rounded-3xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 px-1">Location</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 opacity-50">location_on</span>
                  <input 
                    type="text" 
                    required
                    placeholder="Address or name of place"
                    className="w-full pl-14 pr-6 py-5 bg-surface-container/30 border-2 border-outline-variant/30 rounded-3xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 px-1">Description</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="What should families know? What to bring? Any safety notes?"
                  className="w-full px-6 py-5 bg-surface-container/30 border-2 border-outline-variant/30 rounded-3xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold leading-relaxed"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-6 relative z-10">
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
                    Creating...
                  </div>
                ) : "Create Event"}
              </Button>
            </div>
          </form>
        </div>
      </AuthAppShell>
    </ProtectedRoute>
  );
}

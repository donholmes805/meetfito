"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { eventService } from "@/services/eventService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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
      <div className="min-h-screen flex flex-col bg-surface-container-lowest">
        <Navbar />
        
        <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-12">
          <div className="mb-12">
            <h1 className="text-3xl font-extrabold mb-2">Create a Meetup</h1>
            <p className="text-on-surface-variant">Fill out the details below to organize a new homeschool gathering.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-10 rounded-[32px] border border-outline-variant shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-on-surface mb-2 px-1">Event Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Science Day at the Park"
                  className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-2 px-1">Event Type</label>
                <select 
                  className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
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
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-2 px-1">Age Range</label>
                <select 
                  className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
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
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-2 px-1">Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-2 px-1">Start Time</label>
                <input 
                  type="time" 
                  required
                  className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-on-surface mb-2 px-1">Location</label>
                <input 
                  type="text" 
                  required
                  placeholder="Address or name of place"
                  className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-on-surface mb-2 px-1">Description</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="What should families know? What to bring?"
                  className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 py-4"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 py-4 shadow-lg shadow-primary/20"
              >
                {loading ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}

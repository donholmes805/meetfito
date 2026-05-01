"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { eventService, FitoEvent } from "@/services/eventService";
import { isFirebaseConfigValid } from "@/lib/firebase/client";
import { ReportButton } from "@/components/safety/ReportButton";
import { canCreateEvent, isProUser } from "@/lib/auth/rbac";
import { useAuth } from "@/context/AuthContext";
import { SubscriptionModal } from "@/components/monetization/SubscriptionModal";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthAppShell } from "@/components/layout/AuthAppShell";

const MOCK_EVENTS = [
  {
    id: "1",
    title: "Park Day at Central Park",
    type: "Park Day",
    locationName: "Central Park",
    city: "New York",
    state: "NY",
    date: "2024-05-15",
    startTime: "10:00 AM",
    ageRange: "5-10 years",
    hostName: "Sarah J.",
    description: "Join us for a fun morning of play and socializing! We'll be near the playground on the north side.",
  },
  {
    id: "2",
    title: "Homeschool Math Co-Op",
    type: "Co-Op",
    locationName: "Community Center",
    city: "Brooklyn",
    state: "NY",
    date: "2024-05-16",
    startTime: "1:00 PM",
    ageRange: "8-12 years",
    hostName: "Mike R.",
    description: "Focusing on geometry and hands-on math projects this week. Bring your protractors!",
  },
  {
    id: "3",
    title: "Nature Walk & Science Study",
    type: "Study",
    locationName: "Botanical Garden",
    city: "Bronx",
    state: "NY",
    date: "2024-05-18",
    startTime: "9:30 AM",
    ageRange: "All Ages",
    hostName: "Linda K.",
    description: "Exploring the native plant section and documenting our findings in our nature journals.",
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState<FitoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!isFirebaseConfigValid) {
          setEvents(MOCK_EVENTS as any);
          setLoading(false);
          return;
        }
        
        const data = await eventService.getAllEvents();
        if (data.length === 0 && process.env.NODE_ENV === "development") {
          setEvents(MOCK_EVENTS as any);
        } else {
          setEvents(data);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents(MOCK_EVENTS as any);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <ProtectedRoute>
      <AuthAppShell>
        <div className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black mb-4 tracking-tight">Homeschool Meetups</h1>
              <p className="text-on-surface-variant text-lg font-medium">Find and join local gatherings in your community.</p>
            </div>
            <Button 
              onClick={() => {
                if (canCreateEvent(profile)) {
                  window.location.href = "/events/create";
                } else {
                  setIsPaywallOpen(true);
                }
              }} 
              className="rounded-3xl h-16 px-10 shadow-xl shadow-primary/20 text-lg font-black"
            >
              <span className="material-symbols-outlined mr-2 font-black">add</span>
              Create Meetup
            </Button>
          </div>

          <SubscriptionModal 
            isOpen={isPaywallOpen} 
            onClose={() => setIsPaywallOpen(false)} 
            featureName="Unlimited Event Creation" 
          />

          {loading ? (
            <div className="py-24 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-on-surface-variant font-bold">Loading meetups...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="py-24 bg-white rounded-[64px] border-2 border-dashed border-outline-variant text-center px-6">
              <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-5xl text-outline">event_busy</span>
              </div>
              <h3 className="text-3xl font-black mb-4">No Meetups Found</h3>
              <p className="text-on-surface-variant max-w-sm mx-auto mb-10 font-medium leading-relaxed text-lg">
                There aren't any meetups scheduled in your area yet. Why not create the first one?
              </p>
              <Button asChild variant="secondary" className="rounded-2xl px-10 h-14 font-black shadow-lg shadow-secondary/10">
                <Link href="/events/create">Create a Meetup</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {events.map((event) => (
                <motion.div 
                  key={event.id}
                  whileHover={{ y: -8 }}
                  className={`bg-white rounded-[48px] overflow-hidden border shadow-sm hover:shadow-2xl transition-all flex flex-col group ${
                    event.boosted ? "border-primary border-4 shadow-primary/10" : "border-outline-variant hover:border-primary/20"
                  }`}
                >
                  <div className="p-8 flex-grow">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit ${
                          event.type === 'pe' ? 'bg-secondary/10 text-secondary' :
                          event.type === 'coop' ? 'bg-primary/10 text-primary' :
                          'bg-tertiary/10 text-tertiary'
                        }`}>
                          {event.type.replace('_', ' ')}
                        </span>
                        {event.boosted && (
                          <span className="px-3 py-1 bg-primary text-white text-[9px] font-black rounded-full w-fit flex items-center gap-1 shadow-sm">
                            <span className="material-symbols-outlined text-[12px] font-black">rocket_launch</span>
                            BOOSTED
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-on-surface">
                          {typeof event.date === 'string' ? event.date : (event.date as any)?.toDate?.().toLocaleDateString() || ""}
                        </p>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">{event.startTime}</p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-black mb-4 leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                    
                    <p className="text-on-surface-variant text-sm font-medium line-clamp-3 mb-8 leading-relaxed">
                      {event.description}
                    </p>

                     <div className="space-y-4 mb-8 bg-surface-container/30 p-5 rounded-3xl border border-outline-variant/30">
                       <div className="flex items-center gap-3 text-on-surface-variant">
                         <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                         <span className="text-sm font-bold">{event.locationName}, {event.city}</span>
                       </div>
                       <div className="flex items-center gap-3 text-on-surface-variant">
                         <span className="material-symbols-outlined text-secondary text-xl">family_restroom</span>
                         <span className="text-sm font-bold">Ages: {event.ageMin || 0}-{event.ageMax || 18}</span>
                       </div>
                       <div className="flex items-center gap-3 text-on-surface-variant">
                         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-outline-variant shadow-sm overflow-hidden">
                           <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${event.hostName}`} 
                            alt="Host"
                            className="w-full h-full object-cover"
                           />
                         </div>
                         <div className="flex flex-col">
                           <span className="text-sm font-black flex items-center gap-1">
                             {event.hostName}
                             {event.hostVerified && (
                               <span className="material-symbols-outlined text-primary text-[16px] fill-1">verified</span>
                             )}
                           </span>
                           <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/70">
                             {event.hostVerified ? "Verified Parent" : "Unverified"}
                           </span>
                         </div>
                       </div>
                     </div>

                     <div className="flex flex-wrap gap-2">
                       <span className="px-3 py-1.5 bg-green-50 text-green-700 text-[9px] font-black rounded-xl flex items-center gap-1 border border-green-200 uppercase tracking-wider">
                         <span className="material-symbols-outlined text-[14px]">security</span>
                         Safety First
                       </span>
                       <span className="px-3 py-1.5 bg-amber-50 text-amber-700 text-[9px] font-black rounded-xl flex items-center gap-1 border border-amber-200 uppercase tracking-wider">
                         <span className="material-symbols-outlined text-[14px]">approval</span>
                         Approval Req
                       </span>
                     </div>
                  </div>

                  <div className="px-8 pb-8 space-y-4 mt-auto">
                    <Button variant="outline" asChild className="w-full rounded-2xl py-6 border-2 font-black text-base shadow-sm hover:bg-primary/5 hover:border-primary/30 transition-all">
                      <Link href={`/events/${event.id}`}>View Details</Link>
                    </Button>
                    <div className="flex justify-between items-center px-2">
                      <ReportButton 
                        targetType="event" 
                        targetId={event.id!} 
                        targetName={event.title} 
                      />
                      {isProUser(profile) && !event.boosted && (
                        <button className="flex items-center gap-1.5 text-[10px] font-black text-primary hover:text-primary-dark transition-colors uppercase tracking-[0.15em]">
                          <span className="material-symbols-outlined text-[14px] font-black">rocket_launch</span>
                          Boost Now
                        </button>
                      )}
                    </div>
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

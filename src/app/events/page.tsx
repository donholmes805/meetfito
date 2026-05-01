"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { eventService, FitoEvent } from "@/services/eventService";
import { isFirebaseConfigValid } from "@/lib/firebase/client";
import { ReportButton } from "@/components/safety/ReportButton";
import { canCreateEvent, isProUser } from "@/lib/auth/rbac";
import { useAuth } from "@/context/AuthContext";
import { SubscriptionModal } from "@/components/monetization/SubscriptionModal";

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
  const [filter, setFilter] = useState("All");
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
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold mb-4">Homeschool Meetups</h1>
            <p className="text-on-surface-variant text-lg">Find and join local gatherings in your community.</p>
          </div>
          <Button 
            onClick={() => {
              if (canCreateEvent(profile)) {
                window.location.href = "/events/create";
              } else {
                setIsPaywallOpen(true);
              }
            }} 
            className="rounded-2xl h-14 px-8 shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined mr-2">add</span>
            Create Meetup
          </Button>
        </div>

        <SubscriptionModal 
          isOpen={isPaywallOpen} 
          onClose={() => setIsPaywallOpen(false)} 
          featureName="Unlimited Event Creation" 
        />

        {loading ? (
          <div className="col-span-full py-24 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-on-surface-variant font-medium">Loading meetups...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="col-span-full py-24 bg-white rounded-[48px] border-2 border-dashed border-outline-variant text-center">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">event_busy</span>
            <h3 className="text-2xl font-bold mb-2">No Meetups Found</h3>
            <p className="text-on-surface-variant max-w-sm mx-auto mb-8">
              There aren't any meetups scheduled in your area yet. Why not create the first one?
            </p>
            <Button asChild variant="secondary" className="rounded-xl px-8 h-12">
              <Link href="/events/create">Create a Meetup</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <motion.div 
                key={event.id}
                whileHover={{ y: -8, scale: event.boosted ? 1.02 : 1 }}
                className={`bg-white rounded-[32px] overflow-hidden border shadow-sm hover:shadow-xl transition-all flex flex-col ${
                  event.boosted ? "border-primary border-4 shadow-primary/20" : "border-outline-variant"
                }`}
              >
                <div className="p-8 flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-2">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest w-fit ${
                        event.type === 'pe' ? 'bg-secondary-container text-on-secondary-container' :
                        event.type === 'coop' ? 'bg-primary-container text-on-primary-container' :
                        'bg-tertiary-container text-on-tertiary-container'
                      }`}>
                        {event.type.replace('_', ' ')}
                      </span>
                      {event.boosted && (
                        <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full w-fit flex items-center gap-1 shadow-sm">
                          <span className="material-symbols-outlined text-[12px]">rocket_launch</span>
                          BOOSTED
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-on-surface">
                        {typeof event.date === 'string' ? event.date : (event.date as any)?.toDate?.().toLocaleDateString() || ""}
                      </p>
                      <p className="text-xs text-on-surface-variant">{event.startTime}</p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4 leading-tight">{event.title}</h3>
                  
                  <p className="text-on-surface-variant text-sm line-clamp-3 mb-6">
                    {event.description}
                  </p>

                   <div className="space-y-3 mb-6">
                     <div className="flex items-center gap-3 text-on-surface-variant">
                       <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                       <span className="text-sm font-medium">{event.locationName}, {event.city}</span>
                     </div>
                     <div className="flex items-center gap-3 text-on-surface-variant">
                       <span className="material-symbols-outlined text-secondary text-xl">family_restroom</span>
                       <span className="text-sm font-medium">Ages: {event.ageMin || 0}-{event.ageMax || 18}</span>
                     </div>
                     <div className="flex items-center gap-3 text-on-surface-variant">
                       <span className="material-symbols-outlined text-tertiary text-xl">person</span>
                       <div className="flex flex-col">
                         <span className="text-sm font-bold flex items-center gap-1">
                           Hosted by {event.hostName}
                           {event.hostVerified ? (
                             <span className="material-symbols-outlined text-primary text-[16px] fill-1" title="Verified Parent">verified</span>
                           ) : (
                             <span className="material-symbols-outlined text-on-surface-variant/30 text-[16px]" title="Not Verified">help</span>
                           )}
                         </span>
                         <span className={`text-[9px] font-bold uppercase tracking-widest ${event.hostVerified ? 'text-primary' : 'text-on-surface-variant/50'}`}>
                           {event.hostVerified ? "Verified Parent Identity" : "Identity not verified yet"}
                         </span>
                       </div>
                     </div>
                   </div>

                   <div className="flex flex-wrap gap-2">
                     <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-md flex items-center gap-1 border border-green-100">
                       <span className="material-symbols-outlined text-[12px]">security</span>
                       SAFETY FIRST
                     </span>
                     <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md flex items-center gap-1 border border-amber-100">
                       <span className="material-symbols-outlined text-[12px]">approval</span>
                       APPROVAL REQUIRED
                     </span>
                   </div>
                </div>

                <div className="px-8 pb-8 space-y-4">
                  <Button variant="outline" asChild className="w-full rounded-xl py-4 border-2">
                    <Link href={`/events/${event.id}`}>View Details</Link>
                  </Button>
                  <div className="flex justify-center gap-4">
                    <ReportButton 
                      targetType="event" 
                      targetId={event.id!} 
                      targetName={event.title} 
                    />
                    {isProUser(profile) && !event.boosted && (
                      <button className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary-dark transition-colors uppercase tracking-widest">
                        <span className="material-symbols-outlined text-[14px]">rocket_launch</span>
                        Boost
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

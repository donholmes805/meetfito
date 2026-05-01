"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { DiscoveryMap } from "@/components/discover/DiscoveryMap";
import { eventService, FitoEvent } from "@/services/eventService";
import { isFirebaseConfigValid } from "@/lib/firebase/client";

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
    attendees: 12,
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
    attendees: 8,
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
    attendees: 15,
  }
];

export default function DiscoverPage() {
  const [events, setEvents] = useState<FitoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [distance, setDistance] = useState("5 miles");

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

  const categories = ["All", "Study", "P.E.", "Park Day", "Field Trip", "Co-Op", "Social"];
  const distances = ["1 mile", "5 miles", "10 miles", "25 miles", "50 miles"];

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-4">Discover Meetups</h1>
            <p className="text-on-surface-variant">Find local homeschool events, co-ops, and study groups near you.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                type="text" 
                placeholder="Search meetups..." 
                className="pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">location_on</span>
              <input 
                type="text" 
                placeholder="Your Location" 
                className="pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-6 mb-12">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Categories</p>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                    category === cat 
                    ? "bg-secondary text-on-secondary shadow-lg shadow-secondary/20" 
                    : "bg-white text-on-surface-variant border border-outline-variant hover:border-secondary/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Distance</p>
            <div className="flex flex-wrap gap-3">
              {distances.map((dist) => (
                <button
                  key={dist}
                  onClick={() => setDistance(dist)}
                  className={`px-5 py-2 rounded-xl font-bold text-xs transition-all ${
                    distance === dist 
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                    : "bg-surface-container text-on-surface-variant border border-outline-variant/30 hover:border-primary/50"
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map View */}
          <div className="lg:col-span-2 order-2 lg:order-1 h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 border border-outline-variant">
            <DiscoveryMap events={events} />
          </div>

          {/* Event Cards List */}
          <div className="lg:col-span-1 order-1 lg:order-2 flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="py-20 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-on-surface-variant text-sm">Finding meetups...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-outline-variant">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">event_busy</span>
                <p className="text-on-surface-variant font-bold text-sm">No meetups found.</p>
              </div>
            ) : (
              events.map((event) => (
                <motion.div 
                  key={event.id}
                  whileHover={{ x: 4 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                      event.type === 'pe' ? 'bg-secondary/10 text-secondary' :
                      event.type === 'coop' ? 'bg-primary/10 text-primary' :
                      'bg-tertiary/10 text-tertiary'
                    }`}>
                      {event.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      {typeof event.date === 'string' ? event.date : (event.date as any)?.toDate?.().toLocaleDateString() || ""}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      {event.locationName}, {event.city}
                    </p>
                    <p className="text-sm text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">schedule</span>
                      {event.startTime}
                    </p>
                    <p className="text-sm text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                      Ages: {event.ageMin}-{event.ageMax}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
                      </div>
                      <span className="text-xs font-bold text-on-surface">{event.hostName}</span>
                    </div>
                    <Button asChild size="sm" variant="outline" className="text-xs py-2 px-4">
                      <Link href={`/events/${event.id}`}>Details</Link>
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
            
            <Button variant="ghost" asChild className="w-full text-primary font-bold">
              <Link href="/events">View All Meetups</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const DashboardContent = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-on-surface mb-2">
          Welcome back, {user?.displayName?.split(" ")[0] || "Explorer"}! 👋
        </h1>
        <p className="text-on-surface-variant text-lg">
          Here's what's happening in your homeschool community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container p-6 rounded-3xl border border-outline-variant">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4">
              <Button asChild className="w-full justify-start gap-3 h-14 rounded-2xl">
                <Link href="/events/create">
                  <span className="material-symbols-outlined">add_circle</span>
                  Create Meetup
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start gap-3 h-14 rounded-2xl border-2">
                <Link href="/discover">
                  <span className="material-symbols-outlined">person_search</span>
                  Find Families
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start gap-3 h-14 rounded-2xl border-2">
                <Link href="/groups/create">
                  <span className="material-symbols-outlined">group_add</span>
                  Create Group
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Areas */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Events */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
              <Link href="/events" className="text-primary font-bold hover:underline">View All</Link>
            </div>
            <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant border-dashed text-center">
              <span className="material-symbols-outlined text-outline text-5xl mb-4">event_busy</span>
              <p className="text-on-surface-variant">No upcoming events yet. Create one to get started!</p>
            </div>
          </section>

          {/* Nearby Meetups */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Nearby Meetups</h2>
              <Link href="/discover" className="text-primary font-bold hover:underline">See Map</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Card Placeholder */}
              <div className="bg-surface p-6 rounded-3xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-sm font-bold">
                    Park Day
                  </span>
                  <span className="text-on-surface-variant text-sm font-medium">2.4 miles away</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Central Park Homeschool Meetup</h3>
                <div className="space-y-2 text-on-surface-variant mb-6">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    <span>Friday, May 15 • 10:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>Central Park, Playground North</span>
                  </div>
                </div>
                <Button variant="secondary" className="w-full">Interested</Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

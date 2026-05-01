"use client";

import React, { useEffect, useState } from "react";
import { eventService, FitoEvent } from "@/services/eventService";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { auditService } from "@/services/auditService";

export const EventsTab = () => {
  const { profile: adminProfile } = useAuth();
  const [events, setEvents] = useState<FitoEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    try {
      await eventService.deleteEvent(id);
      await auditService.logAction({
        actorId: adminProfile?.uid!,
        actorEmail: adminProfile?.email!,
        actorRole: adminProfile?.role!,
        action: "DELETE_EVENT",
        targetType: "event",
        targetId: id,
      });
      fetchEvents();
    } catch (e) {
      alert("Failed to delete event.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Events Management</h2>
        <div className="flex gap-4">
          <Button variant="outline" onClick={fetchEvents} className="rounded-2xl border-2">
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant font-bold">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="p-20 bg-white rounded-[40px] border border-outline-variant text-center">
            <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">calendar_today</span>
            <p className="text-xl font-bold text-on-surface-variant">No events found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[40px] border border-outline-variant overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">Event</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">Organizer</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">Date</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">Location</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">event</span>
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{event.title}</p>
                          <p className="text-xs text-on-surface-variant font-medium uppercase">{event.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-on-surface">{event.hostName}</p>
                      <p className="text-xs text-on-surface-variant font-medium">{event.hostId?.slice(0, 8)}...</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-on-surface">
                        {event.date}
                      </p>
                      <p className="text-xs text-on-surface-variant font-medium">
                        {event.startTime}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-on-surface">{event.city}, {event.state}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => deleteEvent(event.id!)}
                        className="p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

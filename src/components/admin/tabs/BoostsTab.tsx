"use client";

import React, { useEffect, useState } from "react";
import { eventService, FitoEvent } from "@/services/eventService";
import { groupService, FitoGroup } from "@/services/groupService";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { auditService } from "@/services/auditService";

export const BoostsTab = () => {
  const { profile: adminProfile } = useAuth();
  const [boostedEvents, setBoostedEvents] = useState<FitoEvent[]>([]);
  const [boostedGroups, setBoostedGroups] = useState<FitoGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoosts();
  }, []);

  const fetchBoosts = async () => {
    setLoading(true);
    try {
      const events = await eventService.getAllEvents();
      setBoostedEvents(events.filter(e => e.boosted));
      
      const groups = await groupService.getAllGroups();
      setBoostedGroups(groups.filter(g => (g as any).boosted));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const removeBoost = async (type: 'event' | 'group', id: string) => {
    if (!confirm(`Are you sure you want to remove the boost from this ${type}?`)) return;
    try {
      if (type === 'event') {
        await eventService.updateEvent(id, { boosted: false, boostExpiresAt: null });
      } else {
        await groupService.updateGroup(id, { boosted: false, boostExpiresAt: null } as any);
      }
      
      await auditService.logAction({
        actorId: adminProfile?.uid!,
        actorEmail: adminProfile?.email!,
        actorRole: adminProfile?.role!,
        action: `REMOVE_BOOST_${type.toUpperCase()}`,
        targetType: type,
        targetId: id,
      });
      fetchBoosts();
    } catch (e) {
      alert("Failed to remove boost.");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Ad Boosts / Featured</h2>
        <Button variant="outline" onClick={fetchBoosts} className="rounded-2xl border-2">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Boosted Events */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">event_available</span>
            <h3 className="text-xl font-bold uppercase tracking-widest text-[14px]">Boosted Events</h3>
            <span className="ml-auto text-xs font-black bg-primary/10 text-primary px-3 py-1 rounded-full">
              {boostedEvents.length} Active
            </span>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="p-8 text-center text-on-surface-variant font-bold">Loading...</div>
            ) : boostedEvents.length === 0 ? (
              <div className="p-12 bg-white rounded-[32px] border border-outline-variant text-center border-dashed">
                <p className="text-sm font-bold text-on-surface-variant">No boosted events.</p>
              </div>
            ) : (
              boostedEvents.map((event) => (
                <div key={event.id} className="bg-white p-6 rounded-[32px] border-2 border-primary/20 shadow-lg shadow-primary/5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-on-surface">{event.title}</h4>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">
                      Expires: {event.boostExpiresAt ? new Date(event.boostExpiresAt).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                  <button 
                    onClick={() => removeBoost('event', event.id!)}
                    className="p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200"
                  >
                    <span className="material-symbols-outlined text-[18px]">block</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Boosted Groups */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">groups_3</span>
            <h3 className="text-xl font-bold uppercase tracking-widest text-[14px]">Boosted Groups</h3>
            <span className="ml-auto text-xs font-black bg-secondary/10 text-secondary px-3 py-1 rounded-full">
              {boostedGroups.length} Active
            </span>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="p-8 text-center text-on-surface-variant font-bold">Loading...</div>
            ) : boostedGroups.length === 0 ? (
              <div className="p-12 bg-white rounded-[32px] border border-outline-variant text-center border-dashed">
                <p className="text-sm font-bold text-on-surface-variant">No boosted groups.</p>
              </div>
            ) : (
              boostedGroups.map((group) => (
                <div key={group.id} className="bg-white p-6 rounded-[32px] border-2 border-secondary/20 shadow-lg shadow-secondary/5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-on-surface">{group.name}</h4>
                    <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mt-1">
                      Expires: {(group as any).boostExpiresAt ? new Date((group as any).boostExpiresAt).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                  <button 
                    onClick={() => removeBoost('group', group.id!)}
                    className="p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200"
                  >
                    <span className="material-symbols-outlined text-[18px]">block</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

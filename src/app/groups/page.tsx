"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { groupService, FitoGroup } from "@/services/groupService";
import { isFirebaseConfigValid } from "@/lib/firebase/client";
import { ReportButton } from "@/components/safety/ReportButton";
import { canCreateGroup, isProUser } from "@/lib/auth/rbac";
import { useAuth } from "@/context/AuthContext";
import { SubscriptionModal } from "@/components/monetization/SubscriptionModal";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthAppShell } from "@/components/layout/AuthAppShell";

const MOCK_GROUPS = [
  {
    id: "1",
    name: "Valley Homeschool Co-Op",
    description: "A friendly co-op focusing on STEM and outdoor learning for elementary ages.",
    membersCount: 24,
    city: "Sherman Oaks",
    state: "CA",
    visibility: "Public",
    boosted: true
  },
  {
    id: "2",
    name: "Beachside Learning Pod",
    description: "Multi-age learning group that meets at the beach for nature studies and literature.",
    membersCount: 12,
    city: "Santa Monica",
    state: "CA",
    visibility: "Private",
    boosted: false
  },
  {
    id: "3",
    name: "Artistic Explorers",
    description: "Weekly art-focused meetup visiting museums and creating local projects.",
    membersCount: 18,
    city: "Los Angeles",
    state: "CA",
    visibility: "Public",
    boosted: false
  }
];

export default function GroupsPage() {
  const [groups, setGroups] = useState<FitoGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (!isFirebaseConfigValid) {
          setGroups(MOCK_GROUPS as any);
          setLoading(false);
          return;
        }
        
        const data = await groupService.getAllGroups();
        if (data.length === 0 && process.env.NODE_ENV === "development") {
          setGroups(MOCK_GROUPS as any);
        } else {
          setGroups(data);
        }
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        setGroups(MOCK_GROUPS as any);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <ProtectedRoute>
      <AuthAppShell>
        <div className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-black mb-4 tracking-tight">Groups & Co-Ops</h1>
              <p className="text-on-surface-variant text-lg font-medium leading-relaxed">Connect with long-term learning communities and shared-responsibility groups.</p>
            </div>
            <Button 
              onClick={() => {
                if (canCreateGroup(profile)) {
                  window.location.href = "/groups/create";
                } else {
                  setIsPaywallOpen(true);
                }
              }} 
              className="rounded-3xl h-16 px-10 shadow-xl shadow-primary/20 text-lg font-black"
            >
              <span className="material-symbols-outlined mr-2 font-black">add</span>
              Create a Group
            </Button>
          </div>

          <SubscriptionModal 
            isOpen={isPaywallOpen} 
            onClose={() => setIsPaywallOpen(false)} 
            featureName="Unlimited Group Creation" 
          />

          {loading ? (
            <div className="py-24 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-on-surface-variant font-bold">Loading groups...</p>
            </div>
          ) : groups.length === 0 ? (
            <div className="py-24 bg-white rounded-[64px] border-2 border-dashed border-outline-variant text-center px-6">
              <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-5xl text-outline">groups_3</span>
              </div>
              <h3 className="text-3xl font-black mb-4">No Groups Found</h3>
              <p className="text-on-surface-variant max-w-sm mx-auto mb-10 font-medium leading-relaxed text-lg">
                There aren't any public groups in your area yet. Start your own community today!
              </p>
              <Button asChild variant="secondary" className="rounded-2xl px-10 h-14 font-black shadow-lg shadow-secondary/10">
                <Link href="/groups/create">Create a Group</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {groups.map((group) => (
                <motion.div 
                  key={group.id}
                  whileHover={{ y: -8 }}
                  className={`bg-white rounded-[48px] overflow-hidden border shadow-sm hover:shadow-2xl transition-all flex flex-col h-full group ${
                    group.boosted ? "border-primary border-4 shadow-primary/10" : "border-outline-variant hover:border-primary/20"
                  }`}
                >
                  <div className="p-8 flex-grow">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col gap-3">
                        <div className="w-16 h-16 bg-secondary/10 rounded-3xl flex items-center justify-center border border-secondary/5">
                          <span className="material-symbols-outlined text-secondary text-4xl">groups</span>
                        </div>
                        {group.boosted && (
                          <span className="px-3 py-1 bg-primary text-white text-[9px] font-black rounded-full w-fit flex items-center gap-1 shadow-sm">
                            <span className="material-symbols-outlined text-[12px] font-black">rocket_launch</span>
                            BOOSTED
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${
                        group.visibility === 'public' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {group.visibility}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors leading-tight">{group.name}</h3>
                    <p className="text-on-surface-variant text-sm mb-8 flex-grow font-medium leading-relaxed line-clamp-3">
                      {group.description}
                    </p>
                    
                    <div className="space-y-4 mb-8 bg-surface-container/30 p-5 rounded-3xl border border-outline-variant/30">
                      <div className="flex items-center gap-3 text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                        <span className="text-sm font-bold truncate">{group.city}, {group.state}</span>
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant">
                        <span className="material-symbols-outlined text-secondary text-xl">person</span>
                        <span className="text-sm font-bold">{(group as any).membersCount || group.members?.length || 0} Members</span>
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary text-xl fill-1">verified</span>
                        <span className="text-sm font-bold">Lead by Verified Parent</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="px-3 py-1.5 bg-green-50 text-green-700 text-[9px] font-black rounded-xl flex items-center gap-1 border border-green-200 uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[14px]">security</span>
                          Safety First
                        </span>
                        <span className="px-3 py-1.5 bg-primary-50 text-primary-700 text-[9px] font-black rounded-xl flex items-center gap-1 border border-primary-200 uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                          Trusted Co-Op
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-8 pb-8 space-y-4 mt-auto">
                    <Button variant="outline" asChild className="w-full rounded-2xl py-6 border-2 font-black text-base shadow-sm hover:bg-primary/5 hover:border-primary/30 transition-all">
                      <Link href={`/groups/${group.id}`}>View Group</Link>
                    </Button>
                    <div className="flex justify-between items-center px-2">
                      <ReportButton 
                        targetType="group" 
                        targetId={group.id!} 
                        targetName={group.name} 
                      />
                      {isProUser(profile) && !group.boosted && (
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

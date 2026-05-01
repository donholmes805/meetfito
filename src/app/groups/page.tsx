"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { groupService, FitoGroup } from "@/services/groupService";
import { isFirebaseConfigValid } from "@/lib/firebase/client";
import { ReportButton } from "@/components/safety/ReportButton";
import { canCreateGroup, isProUser } from "@/lib/auth/rbac";
import { useAuth } from "@/context/AuthContext";
import { SubscriptionModal } from "@/components/monetization/SubscriptionModal";

const MOCK_GROUPS = [
  {
    id: "1",
    name: "Valley Homeschool Co-Op",
    description: "A friendly co-op focusing on STEM and outdoor learning for elementary ages.",
    members: 24,
    location: "Sherman Oaks, CA",
    subjects: ["Science", "Math", "P.E."],
    visibility: "Public",
  },
  {
    id: "2",
    name: "Beachside Learning Pod",
    description: "Multi-age learning group that meets at the beach for nature studies and literature.",
    members: 12,
    location: "Santa Monica, CA",
    subjects: ["Nature Study", "Reading"],
    visibility: "Private",
  },
  {
    id: "3",
    name: "Artistic Explorers",
    description: "Weekly art-focused meetup visiting museums and creating local projects.",
    members: 18,
    location: "Downtown LA, CA",
    subjects: ["Art", "History"],
    visibility: "Public",
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
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold mb-4">Groups & Co-Ops</h1>
            <p className="text-on-surface-variant text-lg">Connect with long-term learning communities and shared-responsibility groups.</p>
          </div>
          <Button 
            onClick={() => {
              if (canCreateGroup(profile)) {
                window.location.href = "/groups/create";
              } else {
                setIsPaywallOpen(true);
              }
            }} 
            size="lg" className="h-14 px-8 rounded-2xl shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined mr-2">add</span>
            Create a Group
          </Button>
        </div>

        <SubscriptionModal 
          isOpen={isPaywallOpen} 
          onClose={() => setIsPaywallOpen(false)} 
          featureName="Unlimited Group Creation" 
        />

        {loading ? (
          <div className="col-span-full py-24 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-on-surface-variant font-medium">Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="col-span-full py-24 bg-white rounded-[48px] border-2 border-dashed border-outline-variant text-center">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">groups_3</span>
            <h3 className="text-2xl font-bold mb-2">No Groups Found</h3>
            <p className="text-on-surface-variant max-w-sm mx-auto mb-8">
              There aren't any public groups in your area yet. Start your own community today!
            </p>
            <Button asChild variant="secondary" className="rounded-xl px-8 h-12">
              <Link href="/groups/create">Create a Group</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map((group) => (
              <motion.div 
                key={group.id}
                whileHover={{ y: -4, scale: group.boosted ? 1.02 : 1 }}
                className={`bg-white p-8 rounded-[32px] shadow-sm border transition-all flex flex-col h-full ${
                  group.boosted ? "border-primary border-4 shadow-primary/20" : "border-outline-variant"
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-3">
                    <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-3xl">groups</span>
                    </div>
                    {group.boosted && (
                      <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full w-fit flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[12px]">rocket_launch</span>
                        BOOSTED
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                    group.visibility === 'public' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {group.visibility}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{group.name}</h3>
                <p className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">
                  {group.description}
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    {group.city}, {group.state}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    {group.members.length} Members
                  </div>
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    <span className="flex items-center gap-1">
                      Lead by Verified Parent
                      <span className="material-symbols-outlined text-primary text-[14px] fill-1">verified</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-md flex items-center gap-1 border border-green-100">
                      <span className="material-symbols-outlined text-[12px]">security</span>
                      SAFETY FIRST
                    </span>
                    <span className="px-2 py-1 bg-primary-50 text-primary-700 text-[10px] font-bold rounded-md flex items-center gap-1 border border-primary-100">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      TRUSTED CO-OP
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button variant="outline" asChild className="w-full font-bold py-4 rounded-xl border-2">
                    <Link href={`/groups/${group.id}`}>View Group</Link>
                  </Button>
                  <div className="flex justify-center gap-4">
                    <ReportButton 
                      targetType="group" 
                      targetId={group.id!} 
                      targetName={group.name} 
                    />
                    {isProUser(profile) && !group.boosted && (
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

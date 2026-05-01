"use client";

import React, { useEffect, useState } from "react";
import { groupService, FitoGroup } from "@/services/groupService";
import { Button } from "@/components/ui/Button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthAppShell } from "@/components/layout/AuthAppShell";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function GroupDetailPage() {
  const { id } = useParams();
  const [group, setGroup] = useState<FitoGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchGroup = async () => {
      if (typeof id !== "string") return;
      try {
        const data = await groupService.getGroupById(id);
        setGroup(data);
      } catch (error) {
        console.error("Failed to fetch group:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <ProtectedRoute>
        <AuthAppShell>
          <div className="flex-grow flex items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-outline">group_off</span>
            </div>
            <h1 className="text-3xl font-black mb-4">Group Not Found</h1>
            <Button className="rounded-2xl h-14 px-8 font-black shadow-lg" onClick={() => router.push("/groups")}>Back to Groups</Button>
          </div>
        </AuthAppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AuthAppShell>
        <div className="max-w-4xl mx-auto w-full pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[56px] overflow-hidden border border-outline-variant shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-secondary via-primary to-secondary" />
            
            <div className="p-10 md:p-16">
              <div className="flex flex-wrap gap-4 mb-10">
                <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                  group.visibility === 'public' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {group.visibility} Community
                </span>
                {group.boosted && (
                  <span className="px-5 py-2 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-[14px] font-black">rocket_launch</span>
                    Featured Community
                  </span>
                )}
              </div>

              <h1 className="text-5xl font-black mb-10 tracking-tighter leading-[1.1] text-on-surface">{group.name}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 p-8 bg-surface-container/30 rounded-[40px] border border-outline-variant/30">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-outline-variant/20">
                    <span className="material-symbols-outlined text-secondary text-2xl">location_on</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-0.5 opacity-60">Location</p>
                    <p className="font-black text-on-surface">{group.city}, {group.state}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-outline-variant/20">
                    <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-0.5 opacity-60">Typical Schedule</p>
                    <p className="font-black text-on-surface">{group.schedule}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-outline-variant/20">
                    <span className="material-symbols-outlined text-secondary text-2xl">person</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-0.5 opacity-60">Members</p>
                    <p className="font-black text-on-surface">{group.members?.length || 0} Families</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none mb-12">
                <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">diversity_3</span>
                  Our Mission
                </h3>
                <p className="text-on-surface-variant leading-relaxed text-lg font-medium">
                  {group.description}
                </p>
              </div>

              {group.subjects && group.subjects.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest mb-4 px-1">Learning Focus</h3>
                  <div className="flex flex-wrap gap-3">
                    {group.subjects.map((subject, idx) => (
                      <span key={idx} className="px-4 py-2 bg-surface-container rounded-xl text-sm font-bold border border-outline-variant/30">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-outline-variant/50">
                <Button className="h-20 px-12 rounded-3xl text-xl font-black shadow-2xl shadow-primary/30 flex-grow sm:flex-grow-0 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Request to Join
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 px-10 rounded-3xl font-black text-lg border-2 flex items-center gap-3 transition-all hover:bg-primary/5 hover:border-primary/30"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }}
                >
                  <span className="material-symbols-outlined text-2xl">share</span>
                  Share Group
                </Button>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-10 p-8 bg-surface-container/50 rounded-[40px] border-2 border-outline-variant/50 flex items-start gap-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-3xl fill-1">verified</span>
            </div>
            <div>
              <h4 className="text-lg font-black text-on-surface mb-2">Verified Community</h4>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                This group was created and is managed by <span className="text-primary font-black">{group.ownerName}</span>, a verified parent on Meet Fito. 
                Joining requests are reviewed by the group owner to maintain a safe environment.
              </p>
            </div>
          </div>
        </div>
      </AuthAppShell>
    </ProtectedRoute>
  );
}

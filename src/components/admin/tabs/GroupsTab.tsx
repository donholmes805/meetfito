"use client";

import React, { useEffect, useState } from "react";
import { groupService, FitoGroup } from "@/services/groupService";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { auditService } from "@/services/auditService";

export const GroupsTab = () => {
  const { profile: adminProfile } = useAuth();
  const [groups, setGroups] = useState<FitoGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await groupService.getAllGroups();
      setGroups(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (id: string) => {
    if (!confirm("Are you sure you want to delete this group? All members and data will be removed.")) return;
    try {
      await groupService.deleteGroup(id);
      await auditService.logAction({
        actorId: adminProfile?.uid!,
        actorEmail: adminProfile?.email!,
        actorRole: adminProfile?.role!,
        action: "DELETE_GROUP",
        targetType: "group",
        targetId: id,
      });
      fetchGroups();
    } catch (e) {
      alert("Failed to delete group.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Groups / Co-Ops</h2>
        <Button variant="outline" onClick={fetchGroups} className="rounded-2xl border-2">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-on-surface-variant font-bold">Loading groups...</div>
        ) : groups.length === 0 ? (
          <div className="col-span-full p-20 bg-white rounded-[40px] border border-outline-variant text-center">
            <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">groups</span>
            <p className="text-xl font-bold text-on-surface-variant">No groups found.</p>
          </div>
        ) : (
          groups.map((group) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[40px] p-8 border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-3xl">diversity_1</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => deleteGroup(group.id!)}
                      className="p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-black mb-2">{group.name}</h3>
                <p className="text-sm text-on-surface-variant font-medium mb-6 line-clamp-2">{group.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm font-bold text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">person</span>
                    <span>Leader: {group.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">group</span>
                    <span>{group.members?.length || 0} Members</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>{group.city}, {group.state}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-outline-variant flex justify-between items-center">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  group.visibility === 'private' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                }`}>
                  {group.visibility === 'private' ? 'Private' : 'Public'}
                </span>
                <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase">
                  ID: {group.id?.slice(-8)}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

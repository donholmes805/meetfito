"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthAppShell } from "@/components/layout/AuthAppShell";
import { motion } from "framer-motion";

export default function CreateGroupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    schedule: "",
    location: "",
    visibility: "Public",
    subjects: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock save to Firestore
    console.log("Saving group:", formData);
    setTimeout(() => {
      setLoading(false);
      router.push("/groups");
    }, 1000);
  };

  return (
    <ProtectedRoute>
      <AuthAppShell>
        <div className="max-w-3xl mx-auto w-full pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 text-secondary mb-4">
              <span className="material-symbols-outlined font-black">groups</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Community Builder</span>
            </div>
            <h1 className="text-4xl font-black mb-4 tracking-tighter leading-tight">Start a Community</h1>
            <p className="text-on-surface-variant text-lg font-medium leading-relaxed">
              Create a space for long-term collaboration, shared learning, and community building.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-10 bg-white p-8 md:p-14 rounded-[56px] border border-outline-variant shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-[100px] -z-0" />
            
            <div className="space-y-8 relative z-10">
              <div>
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 px-1">Group Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Westside Science Co-Op"
                  className="w-full px-6 py-5 bg-surface-container/30 border-2 border-outline-variant/30 rounded-3xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 px-1">Description</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="What is the mission of this group? Who should join?"
                  className="w-full px-6 py-5 bg-surface-container/30 border-2 border-outline-variant/30 rounded-3xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold leading-relaxed"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 px-1">Location / Area</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 opacity-50">location_on</span>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Santa Monica"
                      className="w-full pl-14 pr-6 py-5 bg-surface-container/30 border-2 border-outline-variant/30 rounded-3xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 px-1">Typical Schedule</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 opacity-50">schedule</span>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Tuesdays 10am-2pm"
                      className="w-full pl-14 pr-6 py-5 bg-surface-container/30 border-2 border-outline-variant/30 rounded-3xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                      value={formData.schedule}
                      onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 px-1">Primary Subjects</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 opacity-50">auto_stories</span>
                    <input 
                      type="text" 
                      placeholder="e.g. Art, Math, Nature"
                      className="w-full pl-14 pr-6 py-5 bg-surface-container/30 border-2 border-outline-variant/30 rounded-3xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                      value={formData.subjects}
                      onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 px-1">Privacy Level</label>
                  <div className="relative">
                    <select 
                      className="w-full px-6 py-5 bg-surface-container/30 border-2 border-outline-variant/30 rounded-3xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold appearance-none"
                      value={formData.visibility}
                      onChange={(e) => setFormData({...formData, visibility: e.target.value})}
                    >
                      <option>Public</option>
                      <option>Private (Invite Only)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-6 relative z-10">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 h-16 rounded-2xl font-black text-lg border-2 hover:bg-surface-container transition-all"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 h-16 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Launching...
                  </div>
                ) : "Launch Group"}
              </Button>
            </div>
          </form>
        </div>
      </AuthAppShell>
    </ProtectedRoute>
  );
}

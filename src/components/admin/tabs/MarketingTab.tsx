"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export const MarketingTab = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Placeholder for email/push notification service integration
    setTimeout(() => {
      alert("Campaign queued for delivery!");
      setSending(false);
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Marketing & Communications</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSend} className="bg-white rounded-[40px] p-10 border border-outline-variant shadow-sm space-y-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">campaign</span>
              New Announcement Campaign
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest px-1 text-on-surface-variant">Target Audience</label>
              <select 
                value={target} 
                onChange={e => setTarget(e.target.value)}
                className="w-full bg-surface-container rounded-2xl px-6 py-4 font-bold border-none outline-none"
              >
                <option value="all">All Registered Users</option>
                <option value="pro">Pro Parents Only</option>
                <option value="leaders">Co-Op Leaders Only</option>
                <option value="verified">Verified Users Only</option>
                <option value="unverified">Unverified Users Only</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest px-1 text-on-surface-variant">Campaign Subject</label>
              <input 
                required 
                value={subject} 
                onChange={e => setSubject(e.target.value)}
                placeholder="Exciting New Feature: Group Messaging!" 
                className="w-full bg-surface-container rounded-2xl px-6 py-4 font-bold border-none outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest px-1 text-on-surface-variant">Message Body (HTML supported)</label>
              <textarea 
                required 
                value={message} 
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-surface-container rounded-3xl px-6 py-4 font-medium border-none outline-none focus:ring-2 focus:ring-primary/20 h-48"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button disabled={sending} type="submit" className="h-16 px-12 rounded-3xl text-lg shadow-xl shadow-primary/20">
                {sending ? "Queuing..." : "Send Campaign"}
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container p-8 rounded-[40px] border border-outline-variant">
            <h4 className="font-bold mb-4 uppercase tracking-widest text-xs opacity-60 text-on-surface-variant">Marketing Stats</h4>
            <div className="space-y-6">
              <div>
                <p className="text-2xl font-black text-on-surface">1,284</p>
                <p className="text-xs font-bold text-on-surface-variant uppercase">Total Reachable Users</p>
              </div>
              <div className="pt-6 border-t border-outline-variant/30">
                <p className="text-2xl font-black text-secondary">84%</p>
                <p className="text-xs font-bold text-on-surface-variant uppercase">Email Open Rate (Avg)</p>
              </div>
              <div className="pt-6 border-t border-outline-variant/30">
                <p className="text-2xl font-black text-primary">12</p>
                <p className="text-xs font-bold text-on-surface-variant uppercase">Campaigns Sent (30d)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/5 p-8 rounded-[40px] border border-primary/10">
            <h4 className="font-bold mb-4 uppercase tracking-widest text-xs text-primary">Quick Tips</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Keep announcements short and focused. Use bold calls to action and personalized subject lines for 2x engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

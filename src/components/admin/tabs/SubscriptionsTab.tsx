"use client";

import React, { useEffect, useState } from "react";
import { userService, UserProfile } from "@/services/userService";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export const SubscriptionsTab = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const allUsers = await userService.getAllUsers(200);
      const subscribers = allUsers.filter(u => u.plan !== "free" || u.subscriptionStatus === "active");
      setUsers(subscribers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Subscriptions</h2>
        <div className="flex gap-4">
          <div className="bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Active Subscribers</p>
            <p className="text-2xl font-black text-primary">{users.length}</p>
          </div>
          <Button variant="outline" onClick={fetchSubscribers} className="rounded-2xl border-2">
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-outline-variant overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant font-bold">Loading subscribers...</div>
        ) : users.length === 0 ? (
          <div className="p-20 text-center">
            <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">payments</span>
            <p className="text-xl font-bold text-on-surface-variant">No active subscriptions found.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">User</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">Plan</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">ID</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {users.map((user) => (
                <tr key={user.uid} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img 
                        src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                        className="w-10 h-10 rounded-full"
                        alt=""
                      />
                      <div>
                        <p className="font-bold text-on-surface">{user.displayName || "Anonymous"}</p>
                        <p className="text-xs text-on-surface-variant font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      user.plan === 'leader' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.subscriptionStatus === 'active' ? 'bg-green-500 animate-pulse' : 'bg-outline'}`}></div>
                      <span className="text-sm font-bold text-on-surface capitalize">{user.subscriptionStatus}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[10px] font-mono text-on-surface-variant">{user.stripeSubscriptionId || "N/A"}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="font-black text-on-surface">
                      {user.plan === 'leader' ? '$19.99' : user.plan === 'pro' ? '$9.99' : '$0.00'}/mo
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

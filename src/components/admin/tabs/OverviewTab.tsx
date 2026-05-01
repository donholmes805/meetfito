"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { userService } from "@/services/userService";
import { verificationService } from "@/services/verificationService";
import { reportService } from "@/services/reportService";
import { promoService } from "@/services/promoService";

interface Stats {
  totalUsers: number;
  verifiedParents: number;
  activeSubs: number;
  openReports: number;
  pendingVerifications: number;
  activePromos: number;
}

export const OverviewTab = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, verifications, reports, promos] = await Promise.all([
          userService.getAllUsers(1000), // Note: In production use cloud functions for counts
          verificationService.getPendingVerifications(),
          reportService.getOpenReports(),
          promoService.getAllPromos()
        ]);

        setStats({
          totalUsers: users.length,
          verifiedParents: users.filter(u => u.verifiedParent).length,
          activeSubs: users.filter(u => u.subscriptionStatus === "active").length,
          openReports: reports.length,
          pendingVerifications: verifications.length,
          activePromos: promos.filter(p => p.active).length,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-12 text-center animate-pulse">Loading overview...</div>;

  const cards = [
    { label: "Total Users", value: stats?.totalUsers, icon: "group", color: "text-blue-500" },
    { label: "Verified Parents", value: stats?.verifiedParents, icon: "verified", color: "text-green-500" },
    { label: "Active Subscriptions", value: stats?.activeSubs, icon: "payments", color: "text-purple-500" },
    { label: "Active Promos", value: stats?.activePromos, icon: "sell", color: "text-amber-500" },
    { label: "Pending Verifications", value: stats?.pendingVerifications, icon: "id_card", color: "text-orange-500" },
    { label: "Open Reports", value: stats?.openReports, icon: "report", color: "text-red-500" },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[32px] border border-outline-variant shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`material-symbols-outlined text-[32px] ${card.color}`}>
                {card.icon}
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant opacity-50">Live</span>
            </div>
            <h3 className="text-4xl font-black mb-1">{card.value}</h3>
            <p className="text-sm font-bold text-on-surface-variant">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <section className="bg-surface-container rounded-[40px] p-10 border border-outline-variant">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">analytics</span>
          Platform Health
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-outline-variant">
            <h4 className="font-bold mb-4">User Growth</h4>
            <div className="h-32 flex items-end gap-1 px-4">
              {[40, 60, 45, 90, 65, 80, 100].map((h, i) => (
                <div key={i} className="flex-grow bg-primary/10 rounded-t-lg relative group">
                  <div 
                    className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-500" 
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-outline-variant">
            <h4 className="font-bold mb-4">Verification Velocity</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                </div>
                <div>
                  <p className="font-bold">84% Success Rate</p>
                  <p className="text-xs text-on-surface-variant">Avg. time to verify: 14 mins</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-600">pending</span>
                </div>
                <div>
                  <p className="font-bold">12 Pending</p>
                  <p className="text-xs text-on-surface-variant">Action required from admins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

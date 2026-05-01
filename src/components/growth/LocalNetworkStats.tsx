"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firestore";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { motion } from "framer-motion";

interface LocalNetworkStatsProps {
  city: string;
}

export const LocalNetworkStats = ({ city }: LocalNetworkStatsProps) => {
  const [stats, setStats] = useState({
    families: 0,
    newThisWeek: 0,
    activeMeetups: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!city) {
        setLoading(false);
        return;
      }

      try {
        const usersQ = query(collection(db, "users"), where("city", "==", city));
        const usersSnap = await getDocs(usersQ);
        
        const eventsQ = query(collection(db, "events"), where("city", "==", city), where("status", "==", "upcoming"), limit(10));
        const eventsSnap = await getDocs(eventsQ);

        setStats({
          families: usersSnap.size,
          newThisWeek: Math.floor(usersSnap.size * 0.2), // Mocking for now
          activeMeetups: eventsSnap.size
        });
      } catch (error) {
        console.error("Error fetching local stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [city]);

  if (loading) return null;

  if (!city || stats.families === 0) {
    return (
      <div className="bg-primary/5 rounded-[32px] p-8 border border-primary/10">
        <h3 className="text-xl font-bold mb-2">Be the first in your area! 🏠</h3>
        <p className="text-on-surface-variant text-sm mb-6">
          There are no active homeschool families in your city yet. Start the movement!
        </p>
        <button 
          onClick={() => window.location.href = "/events/create"}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20"
        >
          Create First Meetup
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-[32px] border border-outline-variant shadow-sm"
      >
        <div className="text-primary text-3xl font-black mb-1">{stats.families}</div>
        <div className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Local Families</div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-[32px] border border-outline-variant shadow-sm"
      >
        <div className="text-secondary text-3xl font-black mb-1">+{stats.newThisWeek}</div>
        <div className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">New This Week</div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-[32px] border border-outline-variant shadow-sm"
      >
        <div className="text-tertiary text-3xl font-black mb-1">{stats.activeMeetups}</div>
        <div className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Active Meetups</div>
      </motion.div>
    </div>
  );
};

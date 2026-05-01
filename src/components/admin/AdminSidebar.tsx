"use client";

import React from "react";
import { Role } from "@/lib/auth/rbac";
import { motion } from "framer-motion";

export type AdminTab = 
  | "overview" 
  | "users" 
  | "events" 
  | "groups" 
  | "materials" 
  | "kyc" 
  | "reports" 
  | "video" 
  | "subscriptions" 
  | "promos" 
  | "boosts" 
  | "marketing" 
  | "settings" 
  | "audit";

interface NavItem {
  id: AdminTab;
  label: string;
  icon: string;
  ownerOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: "dashboard" },
  { id: "users", label: "Users", icon: "group" },
  { id: "events", label: "Events", icon: "calendar_today" },
  { id: "groups", label: "Groups / Co-Ops", icon: "groups" },
  { id: "materials", label: "Learning Materials", icon: "menu_book" },
  { id: "kyc", label: "Verifications / KYC", icon: "verified_user" },
  { id: "reports", label: "Reports", icon: "report" },
  { id: "video", label: "Video Rooms", icon: "video_call" },
  { id: "subscriptions", label: "Subscriptions", icon: "payments" },
  { id: "promos", label: "Promo Codes", icon: "sell" },
  { id: "boosts", label: "Boosts", icon: "rocket_launch" },
  { id: "marketing", label: "Marketing", icon: "campaign" },
  { id: "settings", label: "Platform Settings", icon: "settings", ownerOnly: true },
  { id: "audit", label: "Audit Logs", icon: "history" },
];

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  role: Role | null;
}

export const AdminSidebar = ({ activeTab, setActiveTab, role }: AdminSidebarProps) => {
  const isOwner = role === "owner";

  return (
    <aside className="w-72 flex-shrink-0 bg-white border-r border-outline-variant h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar hidden lg:block sticky top-16">
      <div className="p-6">
        <h2 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-8 px-4 opacity-50">
          Admin Control Center
        </h2>
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            if (item.ownerOnly && !isOwner) return null;
            
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[20px] text-sm font-bold transition-all duration-300 group ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/25" 
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] transition-transform duration-300 ${
                  isActive ? "text-white scale-110" : "text-primary group-hover:scale-110"
                }`}>
                  {item.icon}
                </span>
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeTabGlow"
                    className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/lib/auth/rbac";
import { useRouter } from "next/navigation";
import { AdminSidebar, AdminTab } from "@/components/admin/AdminSidebar";
import { OverviewTab } from "@/components/admin/tabs/OverviewTab";
import { UsersTab } from "@/components/admin/tabs/UsersTab";
import { EventsTab } from "@/components/admin/tabs/EventsTab";
import { GroupsTab } from "@/components/admin/tabs/GroupsTab";
import { LearningMaterialsTab } from "@/components/admin/tabs/LearningMaterialsTab";
import { KYCTab } from "@/components/admin/tabs/KYCTab";
import { VideoRoomsTab } from "@/components/admin/tabs/VideoRoomsTab";
import { SubscriptionsTab } from "@/components/admin/tabs/SubscriptionsTab";
import { PromosTab } from "@/components/admin/tabs/PromosTab";
import { BoostsTab } from "@/components/admin/tabs/BoostsTab";
import { MarketingTab } from "@/components/admin/tabs/MarketingTab";
import { ReportsTab } from "@/components/admin/tabs/ReportsTab";
import { AuditLogsTab } from "@/components/admin/tabs/AuditLogsTab";
import { SettingsTab } from "@/components/admin/tabs/SettingsTab";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthAppShell } from "@/components/layout/AuthAppShell";

export default function AdminDashboardPage() {
  const { profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAdmin(profile)) {
      router.push("/dashboard");
    }
  }, [profile, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAdmin(profile)) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "users": return <UsersTab />;
      case "events": return <EventsTab />;
      case "groups": return <GroupsTab />;
      case "materials": return <LearningMaterialsTab />;
      case "kyc": return <KYCTab />;
      case "reports": return <ReportsTab />;
      case "video": return <VideoRoomsTab />;
      case "subscriptions": return <SubscriptionsTab />;
      case "promos": return <PromosTab />;
      case "boosts": return <BoostsTab />;
      case "marketing": return <MarketingTab />;
      case "settings": return <SettingsTab />;
      case "audit": return <AuditLogsTab />;
      default:
        return (
          <div className="p-20 bg-white rounded-[40px] border border-outline-variant text-center">
            <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">construction</span>
            <p className="text-xl font-bold text-on-surface-variant">
              The <span className="text-primary uppercase tracking-widest px-2">{activeTab}</span> module is under construction.
            </p>
          </div>
        );
    }
  };

  return (
    <ProtectedRoute>
      <AuthAppShell>
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="lg:w-72 flex-shrink-0">
            <AdminSidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              role={profile?.role || null} 
            />
          </div>
          
          <div className="flex-grow max-w-full overflow-hidden">
            <div className="mb-10">
              <div className="flex items-center gap-3 text-primary mb-2">
                <span className="material-symbols-outlined font-black">shield_person</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Owner Console</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-on-surface leading-tight">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('_', ' ')}
              </h1>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </AuthAppShell>
    </ProtectedRoute>
  );
}

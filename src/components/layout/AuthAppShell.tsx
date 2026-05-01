"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/lib/auth/rbac";
import { NotificationBell } from "./NotificationBell";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  exact?: boolean;
}

export const AuthAppShell = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: "dashboard", exact: true },
    { label: "Discover", href: "/discover", icon: "explore" },
    { label: "Events", href: "/events", icon: "event" },
    { label: "Groups", href: "/groups", icon: "groups" },
    { label: "Learning", href: "/learning", icon: "school" },
    { label: "Video", href: "/video", icon: "videocam" },
    { label: "Profile", href: "/profile", icon: "person" },
  ];

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  const isDashboard = pathname === "/dashboard";

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col">
      {/* Top Header - Desktop & Mobile */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 border-b border-outline-variant z-[60] h-16 md:h-20 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Mobile Back Button */}
            {!isDashboard && (
              <button 
                onClick={handleBack}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface">arrow_back</span>
              </button>
            )}
            
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl md:text-2xl">diversity_3</span>
              </div>
              <span className="text-lg md:text-xl font-black text-primary tracking-tight">Meet Fito</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  isActive(item) 
                    ? "text-primary bg-primary/5" 
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive(item) ? "fill-1" : ""}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
            {isAdmin(profile) && (
              <Link 
                href="/admin" 
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  pathname.startsWith("/admin") 
                    ? "text-primary bg-primary/5" 
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <NotificationBell />
            
            {/* Desktop Profile Dropdown */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 bg-surface-container hover:bg-surface-container-high px-3 py-2 rounded-2xl border border-outline-variant transition-all"
              >
                <img 
                  src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border-2 border-primary/20"
                />
                <span className="text-sm font-bold text-on-surface truncate max-w-[100px]">
                  {profile?.displayName?.split(" ")[0] || "User"}
                </span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-3xl border border-outline-variant shadow-2xl p-3 z-20"
                    >
                      <div className="p-4 border-b border-outline-variant/50 mb-2">
                        <p className="font-black text-on-surface">{profile?.displayName}</p>
                        <p className="text-xs text-on-surface-variant font-medium truncate">{user?.email}</p>
                      </div>
                      <Link href="/profile" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container transition-colors text-sm font-bold">
                        <span className="material-symbols-outlined text-[20px]">account_circle</span> My Profile
                      </Link>
                      <Link href="/verify" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container transition-colors text-sm font-bold">
                        <span className="material-symbols-outlined text-[20px]">verified</span> Verification
                      </Link>
                      {isAdmin(profile) && (
                        <Link href="/admin" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container transition-colors text-sm font-bold text-primary">
                          <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span> Admin Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 text-red-600 transition-colors text-sm font-bold"
                      >
                        <span className="material-symbols-outlined text-[20px]">logout</span> Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Profile Icon */}
            <Link href="/profile" className="md:hidden w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden">
              <img 
                src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pb-32 md:pb-12">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 md:py-10">
          {/* Desktop Back Button */}
          {!isDashboard && (
            <div className="hidden md:flex mb-8">
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors group"
              >
                <div className="w-10 h-10 rounded-full border-2 border-outline-variant flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5">
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </div>
                Back
              </button>
            </div>
          )}
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-outline-variant px-2 py-3 z-50 h-20 shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center max-w-md mx-auto h-full">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`relative flex flex-col items-center gap-1 min-w-[50px] transition-all ${
                isActive(item) ? "text-primary scale-110" : "text-on-surface-variant"
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] ${isActive(item) ? "fill-1" : ""}`}>
                {item.icon}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider">
                {item.label}
              </span>
              {isActive(item) && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" 
                />
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

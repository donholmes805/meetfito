"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function ProfileContent() {
  const { user, profile, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar / Info */}
          <div className="lg:col-span-1">
             <div className="bg-white p-8 rounded-[48px] border border-outline-variant shadow-xl text-center">
                <div className="relative inline-block mb-6">
                  <img 
                    src={user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-primary/10 object-cover"
                  />
                  <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </div>
                <h2 className="text-2xl font-bold mb-1">{user.displayName || "Parent Explorer"}</h2>
                <p className="text-on-surface-variant text-sm mb-6">{user.email}</p>
                
                {profile?.verificationStatus === "verified" ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full mb-4 border border-green-200">
                    <span className="material-symbols-outlined text-green-600 text-[16px]">verified</span>
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Verified Identity</span>
                  </div>
                ) : profile?.verificationStatus === "pending" ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-amber-600 text-[16px]">hourglass_empty</span>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">ID Review Pending</span>
                  </div>
                ) : profile?.verificationStatus === "payment_required" || profile?.verificationStatus === "unverified" ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full mb-4 border border-outline-variant">
                    <span className="material-symbols-outlined text-on-surface-variant text-[16px]">help</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Identity Not Verified</span>
                  </div>
                ) : profile?.verificationStatus === "paid_pending_start" ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full mb-4 border border-blue-200">
                    <span className="material-symbols-outlined text-blue-600 text-[16px]">play_circle</span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Awaiting Verification Start</span>
                  </div>
                ) : profile?.verificationStatus === "rejected" ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full mb-4 border border-red-200">
                    <span className="material-symbols-outlined text-red-600 text-[16px]">cancel</span>
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">ID Rejected</span>
                  </div>
                ) : null}

                {profile?.verificationStatus !== "verified" && profile?.verificationStatus !== "pending" && (
                  <div className="mb-8 px-4 py-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <p className="text-xs text-on-surface-variant mb-3">
                      {profile?.verificationStatus === "paid_pending_start" 
                        ? "You've paid the fee! Now complete your identity session."
                        : "Verify your account to access video meetups and premium features."}
                    </p>
                    <Button asChild size="sm" className="w-full rounded-xl text-xs font-bold">
                      <a href={profile?.verificationStatus === "paid_pending_start" ? "/verify/start" : "/verify"}>
                        {profile?.verificationStatus === "paid_pending_start" ? "Complete Verification" : "Verify My Identity ($5)"}
                      </a>
                    </Button>
                  </div>
                )}

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-3 h-14 rounded-2xl">
                    <span className="material-symbols-outlined">settings</span> Account Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 h-14 rounded-2xl">
                    <span className="material-symbols-outlined">notifications</span> Notifications
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={logout}
                    className="w-full justify-start gap-3 h-14 rounded-2xl text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200"
                  >
                    <span className="material-symbols-outlined">logout</span> Sign Out
                  </Button>
                </div>
             </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
             {/* Children Profiles */}
             <div className="bg-white p-8 rounded-[48px] border border-outline-variant shadow-sm">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-bold">Child Profiles</h3>
                   <Button size="sm" variant="secondary" className="flex items-center gap-2 rounded-xl">
                      <span className="material-symbols-outlined text-sm">add</span> Add Child
                   </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/30 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                         <span className="material-symbols-outlined text-blue-600">face</span>
                      </div>
                      <div>
                         <h4 className="font-bold">Leo</h4>
                         <p className="text-xs text-on-surface-variant">Age 8 • Grade 3</p>
                      </div>
                   </div>
                   <div className="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/30 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                         <span className="material-symbols-outlined text-amber-600">face_3</span>
                      </div>
                      <div>
                         <h4 className="font-bold">Maya</h4>
                         <p className="text-xs text-on-surface-variant">Age 6 • Grade 1</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Upcoming Meetups */}
             <div className="bg-white p-8 rounded-[48px] border border-outline-variant shadow-sm">
                <h3 className="text-xl font-bold mb-8">Your Upcoming Meetups</h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/10">
                      <div className="flex items-center gap-6">
                         <div className="text-center bg-secondary/10 px-4 py-3 rounded-2xl min-w-[70px]">
                            <span className="block text-[10px] font-bold text-secondary uppercase tracking-widest">May</span>
                            <span className="block text-2xl font-extrabold text-secondary">15</span>
                         </div>
                         <div>
                            <h4 className="font-bold text-lg">Park Day at Central Park</h4>
                            <p className="text-sm text-on-surface-variant">10:00 AM • Central Park</p>
                         </div>
                      </div>
                      <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20">Confirmed</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

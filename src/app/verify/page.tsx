"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthAppShell } from "@/components/layout/AuthAppShell";

export default function VerifyPage() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleStartKYC = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/kyc/create-checkout-session", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
        },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start payment.");
      }
    } catch (error) {
      console.error("KYC Payment error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <AuthAppShell>
        <div className="max-w-2xl mx-auto w-full pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/5">
              <span className="material-symbols-outlined text-primary text-5xl font-black">verified_user</span>
            </div>
            <h1 className="text-4xl font-black mb-4 tracking-tighter">Verify Parent Identity</h1>
            <p className="text-on-surface-variant text-lg font-medium leading-relaxed">
              Meet Fito uses parent identity verification to help keep homeschool meetups safer. 
              This verifies identity only and is not a background check.
            </p>
          </motion.div>

          <div className="bg-white rounded-[48px] p-8 md:p-12 border border-outline-variant shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[120px] font-black">security</span>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
              <div>
                <h3 className="text-2xl font-black text-on-surface leading-tight">Verified Parent Identity</h3>
                <p className="text-sm text-primary font-black uppercase tracking-[0.2em] mt-1">Secure ID Verification</p>
              </div>
              <div className="text-right bg-surface-container/50 px-6 py-3 rounded-3xl border border-outline-variant/30">
                <span className="text-4xl font-black text-primary">$5</span>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">One-time fee</p>
              </div>
            </div>

            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-green-100">
                  <span className="material-symbols-outlined text-green-600 text-xl font-black">check</span>
                </div>
                <p className="text-base font-bold text-on-surface-variant">Increases trust with other local families</p>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-green-100">
                  <span className="material-symbols-outlined text-green-600 text-xl font-black">check</span>
                </div>
                <p className="text-base font-bold text-on-surface-variant">Required to host events and create groups</p>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-green-100">
                  <span className="material-symbols-outlined text-green-600 text-xl font-black">check</span>
                </div>
                <p className="text-base font-bold text-on-surface-variant">Verified badge on your profile and events</p>
              </div>
            </div>

            <Button 
              className="w-full h-16 rounded-[24px] text-xl font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={handleStartKYC}
              disabled={loading || profile?.verifiedParent}
            >
              {profile?.verifiedParent ? "Already Verified" : "Pay $5 & Start Verification"}
            </Button>

            {profile?.verificationStatus === "rejected" && (
              <div className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500">error</span>
                <p className="text-red-700 text-sm font-bold">
                  Previous verification was rejected. Please contact support.
                </p>
              </div>
            )}
            
            <p className="mt-8 text-center text-xs text-on-surface-variant font-medium">
              By proceeding, you agree to our verification process and terms of service. 
              Verification is processed securely via Didit.
            </p>
          </div>
        </div>
      </AuthAppShell>
    </ProtectedRoute>
  );
}

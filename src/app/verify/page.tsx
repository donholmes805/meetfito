"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

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
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      <main className="flex-grow max-w-2xl mx-auto w-full px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary text-4xl">verified_user</span>
          </div>
          <h1 className="text-4xl font-black mb-4">Verify Parent Identity</h1>
          <p className="text-on-surface-variant leading-relaxed">
            Meet Fito uses parent identity verification to help keep homeschool meetups safer. 
            This verifies identity only and is not a background check.
          </p>
        </motion.div>

        <div className="bg-white rounded-[40px] p-8 md:p-12 border border-outline-variant shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold">Verified Parent Identity</h3>
              <p className="text-sm text-on-surface-variant">Secure ID Verification</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-primary">$5</span>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">One-time fee</p>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-green-500 mt-1">check_circle</span>
              <p className="text-sm">Increases trust with other local families</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-green-500 mt-1">check_circle</span>
              <p className="text-sm">Required to host events and create groups</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-green-500 mt-1">check_circle</span>
              <p className="text-sm">Verified badge on your profile and events</p>
            </div>
          </div>

          <Button 
            className="w-full h-16 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
            onClick={handleStartKYC}
            disabled={loading || profile?.verifiedParent}
          >
            {profile?.verifiedParent ? "Already Verified" : "Pay $5 & Start Verification"}
          </Button>

          {profile?.verificationStatus === "rejected" && (
            <p className="mt-6 text-center text-red-500 text-sm font-medium">
              Previous verification was rejected. Please contact support.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

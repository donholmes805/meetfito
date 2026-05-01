"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthAppShell } from "@/components/layout/AuthAppShell";

export default function VerifyStatusPage() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const status = profile?.verificationStatus || "unverified";

  const renderContent = () => {
    switch (status) {
      case "verified":
        return (
          <>
            <div className="w-24 h-24 bg-green-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/5 border border-green-100">
              <span className="material-symbols-outlined text-green-600 text-5xl font-black">check_circle</span>
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tighter text-on-surface">Verification Successful!</h2>
            <p className="text-on-surface-variant mb-10 font-medium leading-relaxed">
              You are now a Verified Parent on Meet Fito. You can now host events, create groups, and lead meetups with full trust.
            </p>
            <Link href="/profile" className="w-full block">
              <Button className="w-full h-16 rounded-2xl font-black text-lg shadow-lg shadow-primary/20">Go to Profile</Button>
            </Link>
          </>
        );
      case "pending":
        return (
          <>
            <div className="w-24 h-24 bg-amber-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-amber-500/5 border border-amber-100">
              <span className="material-symbols-outlined text-amber-600 text-5xl font-black">hourglass_empty</span>
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tighter text-on-surface">Under Review</h2>
            <p className="text-on-surface-variant mb-10 font-medium leading-relaxed">
              Your identity verification is being processed. This usually takes a few minutes but can take up to 24 hours. We'll notify you once it's complete.
            </p>
            <Link href="/dashboard" className="w-full block">
              <Button variant="secondary" className="w-full h-16 rounded-2xl font-black text-lg shadow-lg shadow-secondary/10">Back to Dashboard</Button>
            </Link>
          </>
        );
      case "rejected":
        return (
          <>
            <div className="w-24 h-24 bg-red-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-500/5 border border-red-100">
              <span className="material-symbols-outlined text-red-600 text-5xl font-black">cancel</span>
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tighter text-on-surface">Verification Declined</h2>
            <p className="text-on-surface-variant mb-10 font-medium leading-relaxed">
              We couldn't verify your identity at this time. Please contact support at <span className="text-primary font-black">help@meetfito.com</span> for more information or to try again.
            </p>
            <Link href="/verify" className="w-full block">
              <Button className="w-full h-16 rounded-2xl font-black text-lg shadow-lg shadow-primary/20">Try Again</Button>
            </Link>
          </>
        );
      default:
        return (
          <>
            <div className="w-24 h-24 bg-primary/10 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/5 border border-primary/10">
              <span className="material-symbols-outlined text-primary text-5xl font-black">payment</span>
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tighter text-on-surface">Verification Required</h2>
            <p className="text-on-surface-variant mb-10 font-medium leading-relaxed">
              Complete the $5 verification payment to continue securing your identity and unlocking all features.
            </p>
            <Link href="/verify" className="w-full block">
              <Button className="w-full h-16 rounded-2xl font-black text-lg shadow-lg shadow-primary/20">Start Verification</Button>
            </Link>
          </>
        );
    }
  };

  return (
    <ProtectedRoute>
      <AuthAppShell>
        <div className="min-h-[60vh] flex items-center justify-center w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="max-w-md w-full text-center bg-white p-12 rounded-[56px] border border-outline-variant shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
            {renderContent()}
          </motion.div>
        </div>
      </AuthAppShell>
    </ProtectedRoute>
  );
}

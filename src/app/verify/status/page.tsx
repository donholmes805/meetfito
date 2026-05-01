"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";

export default function VerifyStatusPage() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
            <div className="w-20 h-20 bg-green-100 rounded-[32px] flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
            </div>
            <h2 className="text-3xl font-black mb-4">Verification Successful!</h2>
            <p className="text-on-surface-variant mb-10">
              You are now a Verified Parent on Meet Fito. You can now host events, create groups, and lead meetups.
            </p>
            <Link href="/profile">
              <Button className="h-14 px-10 rounded-2xl font-bold">Go to Profile</Button>
            </Link>
          </>
        );
      case "pending":
        return (
          <>
            <div className="w-20 h-20 bg-amber-100 rounded-[32px] flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-amber-600 text-4xl">hourglass_empty</span>
            </div>
            <h2 className="text-3xl font-black mb-4">Under Review</h2>
            <p className="text-on-surface-variant mb-10">
              Your identity verification is being processed. This usually takes a few minutes but can take up to 24 hours. We'll notify you once it's complete.
            </p>
            <Link href="/profile">
              <Button variant="outline" className="h-14 px-10 rounded-2xl font-bold">Back to Profile</Button>
            </Link>
          </>
        );
      case "rejected":
        return (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-[32px] flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-red-600 text-4xl">cancel</span>
            </div>
            <h2 className="text-3xl font-black mb-4">Verification Declined</h2>
            <p className="text-on-surface-variant mb-10">
              We couldn't verify your identity at this time. Please contact support at help@meetfito.com for more information or to try again.
            </p>
            <Link href="/profile">
              <Button variant="outline" className="h-14 px-10 rounded-2xl font-bold">Back to Profile</Button>
            </Link>
          </>
        );
      default:
        return (
          <>
            <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-primary text-4xl">payment</span>
            </div>
            <h2 className="text-3xl font-black mb-4">Verification Required</h2>
            <p className="text-on-surface-variant mb-10">
              Complete the $5 verification payment to continue securing your identity.
            </p>
            <Link href="/verify">
              <Button className="h-14 px-10 rounded-2xl font-bold">Start Verification</Button>
            </Link>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center bg-white p-12 rounded-[48px] border border-outline-variant shadow-2xl"
        >
          {renderContent()}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

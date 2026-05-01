"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function SafetyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Safe & Trusted</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-background mb-6">Our Safety Standards</h1>
          <p className="text-on-surface-variant text-lg">Meet Fito is built on a foundation of trust. We implement multiple layers of security to ensure our community remains safe for families.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-white p-8 rounded-3xl border border-outline-variant shadow-sm">
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-secondary text-2xl">fingerprint</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Parent Verification</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              We verify the identity of our members to ensure they are genuine parents. This creates a circle of trust within the platform.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-outline-variant shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-2xl">gated_privacy_indicator</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Private Locations</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Specific meetup addresses are only shared with approved attendees who have requested to join an event.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-outline-variant shadow-sm">
            <div className="w-12 h-12 bg-tertiary/10 rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-tertiary text-2xl">report</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Community Reporting</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Our "Vouch & Report" system allows the community to maintain its own standards, with active moderation from the Meet Fito team.
            </p>
          </div>
        </div>

        <div className="bg-surface-container p-12 rounded-[48px] border border-outline-variant flex flex-col md:flex-row items-center gap-12">
           <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6">Ready to verify?</h2>
              <p className="text-on-surface-variant mb-8">
                Verification takes less than 5 minutes and gives you full access to all local meetups and private groups.
              </p>
              <Button size="lg">Start Verification Process</Button>
           </div>
           <div className="flex-1 bg-white p-8 rounded-3xl shadow-lg border border-outline-variant w-full">
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="font-bold">Identity Check</span>
                    <span className="text-secondary text-sm font-bold flex items-center gap-1">
                       <span className="material-symbols-outlined text-sm">check_circle</span> Verified
                    </span>
                 </div>
                 <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-full"></div>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="font-bold">Community Vouching</span>
                    <span className="text-primary text-sm font-bold">Pending</span>
                 </div>
                 <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/3"></div>
                 </div>
              </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

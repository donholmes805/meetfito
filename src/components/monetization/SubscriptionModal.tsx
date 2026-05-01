"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export const SubscriptionModal = ({ isOpen, onClose, featureName }: SubscriptionModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-md rounded-[48px] overflow-hidden shadow-2xl border border-outline-variant"
          >
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-4xl">star</span>
              </div>
              
              <h3 className="text-3xl font-extrabold mb-4">Unlock {featureName}</h3>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                Upgrade to **Meet Fito Pro** to unlock unlimited event creation, AI tools, and video meetups.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-left p-4 bg-surface-container rounded-2xl">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <span className="text-sm font-bold">Unlimited Events & Groups</span>
                </div>
                <div className="flex items-center gap-3 text-left p-4 bg-surface-container rounded-2xl">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <span className="text-sm font-bold">Priority Support & Visibility</span>
                </div>
                <div className="flex items-center gap-3 text-left p-4 bg-surface-container rounded-2xl">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <span className="text-sm font-bold">Full Access to AI Fito Guide</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20">
                  Upgrade Now
                </Button>
                <Button variant="ghost" onClick={onClose} className="w-full h-12 rounded-xl text-on-surface-variant font-bold">
                  Maybe Later
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { reportService } from "@/services/reportService";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface ReportButtonProps {
  targetType: "user" | "event" | "group";
  targetId: string;
  targetName: string;
}

export const ReportButton = ({ targetType, targetId, targetName }: ReportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user, profile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setLoading(true);
    try {
      await reportService.submitReport({
        reporterId: user.uid,
        reporterName: profile.displayName || user.email || "Anonymous",
        targetType,
        targetId,
        targetName,
        reason,
        description,
      });
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setReason("");
        setDescription("");
      }, 3000);
    } catch (error) {
      console.error("Report failed:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant hover:text-red-500 transition-colors uppercase tracking-widest"
      >
        <span className="material-symbols-outlined text-[14px]">flag</span>
        Report
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl border border-outline-variant"
            >
              <div className="p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-green-600 text-3xl">check</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Report Received</h3>
                    <p className="text-sm text-on-surface-variant">Our safety team will review this shortly. Thank you for keeping Meet Fito safe.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">Report {targetType}</h3>
                      <button type="button" onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Reason</label>
                      <select 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      >
                        <option value="">Select a reason...</option>
                        <option value="inappropriate_content">Inappropriate Content</option>
                        <option value="harassment">Harassment</option>
                        <option value="spam">Spam / Scams</option>
                        <option value="safety_concern">Safety Concern</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Details</label>
                      <textarea 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 h-24 text-sm"
                        placeholder="Please provide more context..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="flex-grow rounded-xl">Cancel</Button>
                      <Button type="submit" disabled={loading} className="flex-grow rounded-xl bg-red-500 hover:bg-red-600 border-red-500">
                        {loading ? "Submitting..." : "Submit Report"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

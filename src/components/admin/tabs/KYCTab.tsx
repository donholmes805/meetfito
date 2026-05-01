"use client";

import React, { useEffect, useState } from "react";
import { verificationService, VerificationRequest } from "@/services/verificationService";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export const KYCTab = () => {
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const data = await verificationService.getPendingVerifications();
      setVerifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, userId: string) => {
    try {
      await verificationService.approveVerification(id, userId);
      setVerifications(prev => prev.filter(v => v.id !== id));
    } catch (error) {
      alert("Failed to approve verification.");
    }
  };

  const handleReject = async (id: string, userId: string) => {
    const notes = prompt("Enter reason for rejection:");
    if (notes === null) return;
    try {
      await verificationService.rejectVerification(id, userId, notes);
      setVerifications(prev => prev.filter(v => v.id !== id));
    } catch (error) {
      alert("Failed to reject verification.");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black">Verification Queue</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-on-surface-variant font-bold">Loading queue...</div>
        ) : verifications.length === 0 ? (
          <div className="col-span-full p-20 bg-white rounded-[40px] border border-outline-variant text-center">
            <span className="material-symbols-outlined text-[64px] text-green-200 mb-4">verified</span>
            <p className="text-xl font-bold text-on-surface-variant">Queue is empty. Great job!</p>
          </div>
        ) : (
          verifications.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[40px] border border-outline-variant shadow-sm"
            >
              <h4 className="text-xl font-black mb-1">{v.userName}</h4>
              <p className="text-xs text-on-surface-variant mb-6 uppercase tracking-widest font-black opacity-50">
                Submitted {v.submittedAt?.toDate?.().toLocaleDateString()}
              </p>
              
              <div className="flex gap-3">
                <Button 
                  className="flex-grow rounded-2xl bg-green-600 hover:bg-green-700 border-green-600 h-12" 
                  onClick={() => handleApprove(v.id!, v.userId)}
                >
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-grow rounded-2xl text-red-600 border-red-100 hover:bg-red-50 h-12" 
                  onClick={() => handleReject(v.id!, v.userId)}
                >
                  Reject
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

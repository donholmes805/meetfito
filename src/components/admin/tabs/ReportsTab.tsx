"use client";

import React, { useEffect, useState } from "react";
import { reportService, SafetyReport } from "@/services/reportService";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export const ReportsTab = () => {
  const [reports, setReports] = useState<SafetyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await reportService.getOpenReports();
      setReports(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await reportService.resolveReport(id);
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      alert("Failed to resolve report.");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black">Safety Reports</h2>
      <div className="space-y-6">
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant font-bold animate-pulse">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-20 bg-white rounded-[40px] border border-outline-variant text-center">
            <span className="material-symbols-outlined text-[64px] text-green-200 mb-4">gpp_good</span>
            <p className="text-xl font-bold text-on-surface-variant">No safety reports. The community is safe!</p>
          </div>
        ) : (
          reports.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[40px] border border-outline-variant shadow-sm flex flex-col md:flex-row gap-8 items-start"
            >
              <div className="flex-grow space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2 inline-block">
                      {r.reason.replace('_', ' ')}
                    </span>
                    <h4 className="text-xl font-black">Reported {r.targetType}: {r.targetName}</h4>
                    <p className="text-xs font-bold text-on-surface-variant opacity-60">Reporter: {r.reporterName}</p>
                  </div>
                </div>
                <div className="p-6 bg-surface-container rounded-3xl text-sm font-medium leading-relaxed italic">
                  "{r.description}"
                </div>
              </div>
              <div className="flex-shrink-0 w-full md:w-48">
                <Button variant="primary" className="w-full h-14 rounded-2xl shadow-lg shadow-primary/10" onClick={() => handleResolve(r.id!)}>
                  Resolve Report
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

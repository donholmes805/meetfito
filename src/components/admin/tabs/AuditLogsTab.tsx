"use client";

import React, { useEffect, useState } from "react";
import { auditService, AuditLog } from "@/services/auditService";
import { motion } from "framer-motion";

export const AuditLogsTab = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await auditService.getRecentLogs(100);
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes("DELETE")) return "bg-red-100 text-red-700";
    if (action.includes("CREATE")) return "bg-green-100 text-green-700";
    if (action.includes("UPDATE")) return "bg-blue-100 text-blue-700";
    return "bg-surface-container text-on-surface-variant";
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Audit Logs</h2>
        <button 
          onClick={fetchLogs}
          className="p-3 bg-white border border-outline-variant rounded-2xl hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-lowest border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Admin</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Action</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Target</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant font-medium">Loading logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant font-medium">No logs found.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <p className="text-xs font-bold text-on-surface">
                        {log.createdAt?.toDate?.().toLocaleString() || "Just now"}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{log.actorEmail}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">{log.actorRole}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-50">{log.targetType}</span>
                        <span className="text-xs font-medium truncate max-w-[150px]">{log.targetId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {log.after && (
                        <div className="text-[10px] bg-surface-container p-2 rounded-lg font-mono text-on-surface-variant max-w-xs overflow-hidden truncate">
                          {JSON.stringify(log.after)}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/lib/auth/rbac";
import { verificationService, VerificationRequest } from "@/services/verificationService";
import { reportService, SafetyReport } from "@/services/reportService";
import { userService } from "@/services/userService";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const { profile, loading: authLoading } = useAuth();
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [reports, setReports] = useState<SafetyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchUid, setSearchUid] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAdmin(profile)) {
      router.push("/");
    }
  }, [profile, authLoading]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin(profile)) return;
      try {
        const [vData, rData] = await Promise.all([
          verificationService.getPendingVerifications(),
          reportService.getOpenReports()
        ]);
        setVerifications(vData);
        setReports(rData);
      } catch (error) {
        console.error("Admin data fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profile]);

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

  const handleResolveReport = async (id: string) => {
    try {
      await reportService.resolveReport(id);
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      alert("Failed to resolve report.");
    }
  };

  const handleSearchUser = async () => {
    if (!searchUid.trim()) return;
    setUpdating(true);
    try {
      const userProfile = await userService.getProfile(searchUid);
      setSearchResult(userProfile);
    } catch (error) {
      alert("User not found.");
      setSearchResult(null);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePlan = async (plan: "free" | "pro" | "leader") => {
    if (!searchResult || !searchUid) return;
    setUpdating(true);
    try {
      await userService.updateProfile(searchUid, { 
        plan,
        subscriptionStatus: plan === "free" ? "inactive" : "active"
      });
      setSearchResult({ ...searchResult, plan });
      alert(`User updated to ${plan}!`);
    } catch (error) {
      alert("Failed to update plan.");
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-12">Admin Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Verification Queue */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">verified_user</span>
              Verification Queue ({verifications.length})
            </h2>
            <div className="space-y-4">
              {verifications.length === 0 ? (
                <div className="p-12 bg-white rounded-3xl border border-outline-variant text-center">
                  <p className="text-on-surface-variant font-medium">No pending verifications.</p>
                </div>
              ) : (
                verifications.map(v => (
                  <div key={v.id} className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{v.userName}</h4>
                        <p className="text-xs text-on-surface-variant">Submitted: {v.submittedAt?.toDate?.().toLocaleString()}</p>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-widest">Pending</span>
                    </div>
                    <div className="flex gap-3">
                      <Button size="sm" className="flex-grow rounded-xl bg-green-600 hover:bg-green-700 border-green-600" onClick={() => handleApprove(v.id!, v.userId)}>Approve</Button>
                      <Button size="sm" variant="outline" className="flex-grow rounded-xl text-red-600 border-red-100 hover:bg-red-50" onClick={() => handleReject(v.id!, v.userId)}>Reject</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Safety Reports */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">report</span>
              Safety Reports ({reports.length})
            </h2>
            <div className="space-y-4">
              {reports.length === 0 ? (
                <div className="p-12 bg-white rounded-3xl border border-outline-variant text-center">
                  <p className="text-on-surface-variant font-medium">No open reports.</p>
                </div>
              ) : (
                reports.map(r => (
                  <div key={r.id} className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1 block">{r.reason.replace('_', ' ')}</span>
                        <h4 className="font-bold text-lg">Reported {r.targetType}: {r.targetName}</h4>
                        <p className="text-xs text-on-surface-variant">Reporter: {r.reporterName}</p>
                      </div>
                    </div>
                    <p className="text-sm text-on-surface-variant p-4 bg-surface-container rounded-2xl mb-6">
                      {r.description}
                    </p>
                    <Button size="sm" variant="primary" className="w-full rounded-xl" onClick={() => handleResolveReport(r.id!)}>Mark Resolved</Button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* KYC / Identity Verification */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">id_card</span>
            Identity Verifications (KYC)
          </h2>
          <div className="bg-white rounded-[40px] border border-outline-variant overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-lowest border-b border-outline-variant">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">User</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Provider</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Paid</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {/* This would ideally be fetched from Firestore 'verifications' collection */}
                  {/* For now, we'll show a placeholder or handle it via user search */}
                  <tr>
                    <td className="px-6 py-6" colSpan={5}>
                      <p className="text-sm text-on-surface-variant text-center">
                        Use the User Search below to manage specific identity overrides.
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Owner Overrides */}
        <section className="mt-16">
          <div className="p-10 bg-surface-container rounded-[48px] border border-outline-variant">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined">settings_suggest</span>
              Owner Subscription Overrides
            </h2>
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <input 
                type="text" 
                placeholder="Enter User UID..."
                value={searchUid}
                onChange={(e) => setSearchUid(e.target.value)}
                className="flex-grow bg-white border border-outline-variant rounded-2xl px-6 py-4 text-sm font-medium"
              />
              <Button onClick={handleSearchUser} disabled={updating} className="h-14 rounded-2xl px-8 shadow-md">
                Search User
              </Button>
            </div>

            {searchResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-white rounded-3xl border border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div>
                  <h4 className="text-xl font-extrabold mb-1">{searchResult.displayName}</h4>
                  <p className="text-sm text-on-surface-variant font-medium">Current Plan: <span className="text-primary uppercase">{searchResult.plan}</span></p>
                  <p className="text-xs text-on-surface-variant mt-1 opacity-60 truncate max-w-xs">{searchUid}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="rounded-xl border-2" onClick={() => handleUpdatePlan("free")} disabled={updating}>Set Free</Button>
                  <Button size="sm" variant="secondary" className="rounded-xl shadow-sm" onClick={() => handleUpdatePlan("pro")} disabled={updating}>Set Pro</Button>
                  <Button size="sm" variant="primary" className="rounded-xl shadow-sm" onClick={() => handleUpdatePlan("leader")} disabled={updating}>Set Leader</Button>
                  <div className="w-full h-px bg-outline-variant my-2"></div>
                  <Button 
                    size="sm" 
                    className="rounded-xl bg-green-600 hover:bg-green-700 border-green-600"
                    onClick={async () => {
                      setUpdating(true);
                      try {
                        await userService.updateProfile(searchUid, { 
                          verifiedParent: true,
                          verificationStatus: "verified",
                          verificationProvider: "manual"
                        });
                        setSearchResult({ ...searchResult, verifiedParent: true, verificationStatus: "verified" });
                        alert("User manually verified!");
                      } catch (e) { alert("Error verifying user."); }
                      finally { setUpdating(false); }
                    }}
                  >
                    Verify Identity
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Local Domination Strategy */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">map</span>
            Local Domination Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { city: "Los Angeles", families: 142, events: 24, status: "Active" },
              { city: "Santa Barbara", families: 86, events: 12, status: "Growing" },
              { city: "Ventura", families: 54, events: 8, status: "Seeding" },
              { city: "San Luis Obispo", families: 32, events: 4, status: "New" }
            ].map((loc, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm">
                <h4 className="font-extrabold text-lg mb-2">{loc.city}</h4>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                    loc.status === 'Active' ? 'bg-green-100 text-green-700' :
                    loc.status === 'Growing' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {loc.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant font-medium">Families:</span>
                    <span className="font-bold">{loc.families}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant font-medium">Events:</span>
                    <span className="font-bold">{loc.events}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

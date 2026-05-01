"use client";

import React, { useEffect, useState } from "react";
import { UserProfile, userService } from "@/services/userService";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { auditService } from "@/services/auditService";
import { useAuth } from "@/context/AuthContext";
import { isOwner } from "@/lib/auth/rbac";

export const UsersTab = () => {
  const { profile: adminProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers(20);
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchUsers();
      return;
    }
    setLoading(true);
    try {
      const results = await userService.searchUsers(searchTerm);
      setUsers(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (targetUser: UserProfile, newRole: any) => {
    if (newRole === "owner" && !isOwner(adminProfile)) {
      alert("Only the owner can create another owner.");
      return;
    }
    
    if (targetUser.role === "owner" && !isOwner(adminProfile)) {
      alert("Admins cannot modify the owner role.");
      return;
    }

    if (!confirm(`Are you sure you want to change ${targetUser.displayName}'s role to ${newRole}?`)) return;

    setUpdatingUid(targetUser.uid);
    try {
      await userService.updateProfile(targetUser.uid, { role: newRole });
      await auditService.logAction({
        actorId: adminProfile?.uid!,
        actorEmail: adminProfile?.email!,
        actorRole: adminProfile?.role!,
        action: "UPDATE_ROLE",
        targetType: "user",
        targetId: targetUser.uid,
        before: { role: targetUser.role },
        after: { role: newRole },
      });
      fetchUsers();
    } catch (e) {
      alert("Failed to update role.");
    } finally {
      setUpdatingUid(null);
    }
  };

  const updatePlan = async (user: UserProfile, plan: "free" | "pro" | "leader") => {
    if (!confirm(`Set ${user.displayName}'s plan to ${plan}?`)) return;
    setUpdatingUid(user.uid);
    try {
      await userService.updateProfile(user.uid, { 
        plan,
        subscriptionStatus: plan === "free" ? "inactive" : "active"
      });
      await auditService.logAction({
        actorId: adminProfile?.uid!,
        actorEmail: adminProfile?.email!,
        actorRole: adminProfile?.role!,
        action: "UPDATE_PLAN",
        targetType: "user",
        targetId: user.uid,
        before: { plan: user.plan },
        after: { plan },
      });
      fetchUsers();
    } catch (e) {
      alert("Failed to update plan.");
    } finally {
      setUpdatingUid(null);
    }
  };

  const verifyUser = async (user: UserProfile) => {
    if (!confirm(`Manually verify ${user.displayName}?`)) return;
    setUpdatingUid(user.uid);
    try {
      await userService.updateProfile(user.uid, { 
        verifiedParent: true,
        verificationStatus: "verified",
        verificationProvider: "manual"
      });
      await auditService.logAction({
        actorId: adminProfile?.uid!,
        actorEmail: adminProfile?.email!,
        actorRole: adminProfile?.role!,
        action: "MANUAL_VERIFY",
        targetType: "user",
        targetId: user.uid,
      });
      fetchUsers();
    } catch (e) {
      alert("Failed to verify user.");
    } finally {
      setUpdatingUid(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h2 className="text-3xl font-black">User Management</h2>
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-96">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-white border border-outline-variant rounded-2xl px-6 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          <Button type="submit" className="rounded-2xl h-12 px-6">Search</Button>
        </form>
      </div>

      <div className="bg-white rounded-[32px] border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-lowest border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">User</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Plan</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Verification</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant font-medium">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant font-medium">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.uid} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full border border-outline-variant" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {user.displayName?.charAt(0) || user.email?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-sm">{user.displayName || "No Name"}</p>
                          <p className="text-xs text-on-surface-variant">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <select 
                        value={user.role} 
                        onChange={(e) => updateRole(user, e.target.value)}
                        disabled={updatingUid === user.uid}
                        className="bg-surface-container px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider outline-none border border-transparent focus:border-primary/20"
                      >
                        <option value="parent">Parent</option>
                        <option value="coopLeader">Co-Op Leader</option>
                        <option value="admin">Admin</option>
                        <option value="owner">Owner</option>
                      </select>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        user.plan === 'leader' ? 'bg-purple-100 text-purple-700' :
                        user.plan === 'pro' ? 'bg-blue-100 text-blue-700' :
                        'bg-surface-container text-on-surface-variant'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        user.verificationStatus === 'verified' ? 'bg-green-100 text-green-700' :
                        user.verificationStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                        user.verificationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-surface-container text-on-surface-variant'
                      }`}>
                        {user.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-xl px-4 py-1 h-auto text-[10px] uppercase font-black tracking-widest"
                          onClick={() => {
                            const plan = prompt("Enter plan (free, pro, leader):");
                            if (plan === "free" || plan === "pro" || plan === "leader") {
                              updatePlan(user, plan);
                            }
                          }}
                          disabled={updatingUid === user.uid}
                        >
                          Plan
                        </Button>
                        {!user.verifiedParent && (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="rounded-xl px-4 py-1 h-auto text-[10px] uppercase font-black tracking-widest bg-green-600 hover:bg-green-700 border-green-600"
                            onClick={() => verifyUser(user)}
                            disabled={updatingUid === user.uid}
                          >
                            Verify
                          </Button>
                        )}
                      </div>
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

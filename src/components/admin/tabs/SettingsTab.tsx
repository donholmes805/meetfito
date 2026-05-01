"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/firebase/firestore";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { auditService } from "@/services/auditService";

interface PlatformSettings {
  maintenanceMode: boolean;
  registrationOpen: boolean;
  kycPrice: number;
  proParentPrice: number;
  coopLeaderPrice: number;
  globalAnnouncement: string;
}

export const SettingsTab = () => {
  const { profile } = useAuth();
  const [settings, setSettings] = useState<PlatformSettings>({
    maintenanceMode: false,
    registrationOpen: true,
    kycPrice: 20,
    proParentPrice: 10,
    coopLeaderPrice: 25,
    globalAnnouncement: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, "platformSettings", "global"));
        if (docSnap.exists()) {
          setSettings(docSnap.data() as PlatformSettings);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "platformSettings", "global"), {
        ...settings,
        updatedAt: serverTimestamp(),
        updatedBy: profile?.uid,
      });
      
      await auditService.logAction({
        actorId: profile?.uid!,
        actorEmail: profile?.email!,
        actorRole: profile?.role!,
        action: "UPDATE_PLATFORM_SETTINGS",
        targetType: "settings",
        targetId: "global",
        after: settings,
      });

      alert("Settings saved successfully!");
    } catch (e) {
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center font-bold">Loading settings...</div>;

  return (
    <div className="space-y-12 max-w-4xl">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Platform Settings</h2>
        <Button onClick={saveSettings} disabled={saving} className="rounded-2xl px-12 h-14 shadow-xl shadow-primary/20">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-10 rounded-[40px] border border-outline-variant space-y-6">
          <h3 className="text-xl font-black flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">power_settings_new</span>
            Status & Access
          </h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-surface-container rounded-2xl cursor-pointer hover:bg-surface-container-high transition-colors">
              <div>
                <p className="font-bold">Maintenance Mode</p>
                <p className="text-xs text-on-surface-variant">Prevent users from accessing the app</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.maintenanceMode} 
                onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})}
                className="w-6 h-6 accent-primary" 
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-surface-container rounded-2xl cursor-pointer hover:bg-surface-container-high transition-colors">
              <div>
                <p className="font-bold">Registration Open</p>
                <p className="text-xs text-on-surface-variant">Allow new users to sign up</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.registrationOpen} 
                onChange={e => setSettings({...settings, registrationOpen: e.target.checked})}
                className="w-6 h-6 accent-primary" 
              />
            </label>
          </div>
        </section>

        <section className="bg-white p-10 rounded-[40px] border border-outline-variant space-y-6">
          <h3 className="text-xl font-black flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">payments</span>
            Global Pricing ($)
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest px-1 opacity-50">KYC Verification Fee</label>
              <input type="number" value={settings.kycPrice} onChange={e => setSettings({...settings, kycPrice: Number(e.target.value)})} className="w-full bg-surface-container border border-transparent focus:border-primary/20 rounded-2xl px-6 py-4 font-bold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest px-1 opacity-50">Pro Parent Monthly</label>
              <input type="number" value={settings.proParentPrice} onChange={e => setSettings({...settings, proParentPrice: Number(e.target.value)})} className="w-full bg-surface-container border border-transparent focus:border-primary/20 rounded-2xl px-6 py-4 font-bold outline-none" />
            </div>
          </div>
        </section>

        <section className="bg-white p-10 rounded-[40px] border border-outline-variant space-y-6 md:col-span-2">
          <h3 className="text-xl font-black flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">campaign</span>
            Global Announcement
          </h3>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest px-1 opacity-50">Announcement Bar Text (Optional)</label>
            <textarea 
              value={settings.globalAnnouncement} 
              onChange={e => setSettings({...settings, globalAnnouncement: e.target.value})}
              placeholder="e.g. Welcome to Meet Fito! We are officially live in Los Angeles."
              className="w-full bg-surface-container border border-transparent focus:border-primary/20 rounded-3xl px-6 py-4 font-medium outline-none h-24" 
            />
          </div>
        </section>
      </div>
    </div>
  );
};

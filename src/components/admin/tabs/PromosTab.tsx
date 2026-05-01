"use client";

import React, { useEffect, useState } from "react";
import { PromoCode, promoService, PromoDiscountType, PromoAppliesTo } from "@/services/promoService";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { auditService } from "@/services/auditService";

export const PromosTab = () => {
  const { profile: adminProfile } = useAuth();
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<PromoDiscountType>("percent");
  const [percentOff, setPercentOff] = useState<number | null>(null);
  const [amountOff, setAmountOff] = useState<number | null>(null);
  const [appliesTo, setAppliesTo] = useState<PromoAppliesTo>("all");
  const [maxRedemptions, setMaxRedemptions] = useState<number | null>(null);
  const [perUserLimit, setPerUserLimit] = useState(1);
  const [active, setActive] = useState(true);

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const data = await promoService.getAllPromos();
      setPromos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const promoId = await promoService.createPromo({
        code: code.toUpperCase().trim(),
        title,
        description,
        discountType,
        percentOff: discountType === "percent" ? percentOff : null,
        amountOff: discountType === "fixed" ? amountOff : null,
        appliesTo,
        maxRedemptions,
        perUserLimit,
        active,
        startsAt: null,
        expiresAt: null,
        createdBy: adminProfile?.uid!,
      });

      await auditService.logAction({
        actorId: adminProfile?.uid!,
        actorEmail: adminProfile?.email!,
        actorRole: adminProfile?.role!,
        action: "CREATE_PROMO",
        targetType: "promo",
        targetId: promoId,
        after: { code: code.toUpperCase().trim(), discountType, appliesTo },
      });

      setShowAddForm(false);
      resetForm();
      fetchPromos();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const toggleActive = async (promo: PromoCode) => {
    try {
      await promoService.updatePromo(promo.id!, { active: !promo.active });
      await auditService.logAction({
        actorId: adminProfile?.uid!,
        actorEmail: adminProfile?.email!,
        actorRole: adminProfile?.role!,
        action: "TOGGLE_PROMO",
        targetType: "promo",
        targetId: promo.id!,
        after: { active: !promo.active },
      });
      fetchPromos();
    } catch (e) {
      alert("Failed to update promo.");
    }
  };

  const deletePromo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo code?")) return;
    try {
      await promoService.deletePromo(id);
      await auditService.logAction({
        actorId: adminProfile?.uid!,
        actorEmail: adminProfile?.email!,
        actorRole: adminProfile?.role!,
        action: "DELETE_PROMO",
        targetType: "promo",
        targetId: id,
      });
      fetchPromos();
    } catch (e) {
      alert("Failed to delete promo.");
    }
  };

  const resetForm = () => {
    setCode("");
    setTitle("");
    setDescription("");
    setDiscountType("percent");
    setPercentOff(null);
    setAmountOff(null);
    setAppliesTo("all");
    setMaxRedemptions(null);
    setPerUserLimit(1);
    setActive(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Promo Codes</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="rounded-2xl px-8 shadow-md">
          {showAddForm ? "Cancel" : "Create New Promo"}
        </Button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreate} className="bg-surface-container rounded-[40px] p-10 border border-outline-variant grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest px-1">Promo Code</label>
                <input required value={code} onChange={e => setCode(e.target.value)} placeholder="LAUNCH100" className="w-full bg-white border border-outline-variant rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest px-1">Display Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Launch Special" className="w-full bg-white border border-outline-variant rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest px-1">Discount Type</label>
                <select value={discountType} onChange={e => setDiscountType(e.target.value as any)} className="w-full bg-white border border-outline-variant rounded-2xl px-6 py-4 font-bold outline-none appearance-none">
                  <option value="percent">Percent Off</option>
                  <option value="fixed">Fixed Amount Off</option>
                  <option value="free_trial">Free Trial</option>
                  <option value="free_kyc">Free KYC Verification</option>
                  <option value="free_plan">Free Plan Grant</option>
                </select>
              </div>

              {discountType === "percent" && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest px-1">Percent Off (%)</label>
                  <input type="number" required value={percentOff || ""} onChange={e => setPercentOff(Number(e.target.value))} className="w-full bg-white border border-outline-variant rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              )}
              {discountType === "fixed" && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest px-1">Amount Off ($)</label>
                  <input type="number" required value={amountOff || ""} onChange={e => setAmountOff(Number(e.target.value))} className="w-full bg-white border border-outline-variant rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest px-1">Applies To</label>
                <select value={appliesTo} onChange={e => setAppliesTo(e.target.value as any)} className="w-full bg-white border border-outline-variant rounded-2xl px-6 py-4 font-bold outline-none appearance-none">
                  <option value="all">All Products</option>
                  <option value="pro_parent">Pro Parent</option>
                  <option value="coop_leader">Co-Op Leader</option>
                  <option value="kyc">KYC Verification</option>
                  <option value="event_boost">Event Boost</option>
                  <option value="group_boost">Group Boost</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest px-1">Max Redemptions</label>
                <input type="number" value={maxRedemptions || ""} onChange={e => setMaxRedemptions(e.target.value ? Number(e.target.value) : null)} placeholder="Infinite" className="w-full bg-white border border-outline-variant rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20" />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="text-xs font-black uppercase tracking-widest px-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white border border-outline-variant rounded-3xl px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-primary/20 h-24" />
              </div>

              <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                <Button type="submit" className="h-16 px-12 rounded-3xl shadow-xl shadow-primary/20 text-lg">Create Promo Code</Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-on-surface-variant font-bold">Loading promos...</div>
        ) : promos.length === 0 ? (
          <div className="col-span-full p-20 bg-white rounded-[40px] border border-outline-variant text-center">
            <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">sell</span>
            <p className="text-xl font-bold text-on-surface-variant">No promo codes yet.</p>
          </div>
        ) : (
          promos.map((promo, i) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-[40px] p-8 border border-outline-variant shadow-sm flex flex-col justify-between ${!promo.active && 'opacity-60'}`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full font-black text-sm tracking-widest">
                    {promo.code}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleActive(promo)} className={`p-2 rounded-xl transition-colors ${promo.active ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                      <span className="material-symbols-outlined text-[18px]">
                        {promo.active ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <button onClick={() => deletePromo(promo.id!)} className="p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
                <h4 className="text-xl font-black mb-1">{promo.title}</h4>
                <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">{promo.description}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-on-surface-variant">Discount:</span>
                    <span className="text-primary uppercase">
                      {promo.discountType === 'percent' ? `${promo.percentOff}% Off` : 
                       promo.discountType === 'fixed' ? `$${promo.amountOff} Off` : 
                       promo.discountType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-on-surface-variant">Applies To:</span>
                    <span className="text-on-surface uppercase tracking-widest">{promo.appliesTo.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-on-surface-variant">Usage:</span>
                    <span className="text-on-surface">
                      {promo.redemptionCount} / {promo.maxRedemptions || '∞'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (promo.redemptionCount / (promo.maxRedemptions || 100)) * 100)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

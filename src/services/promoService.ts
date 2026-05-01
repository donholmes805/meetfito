import { db } from "@/lib/firebase/firestore";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  orderBy
} from "firebase/firestore";

export type PromoDiscountType = "percent" | "fixed" | "free_trial" | "free_kyc" | "free_plan";
export type PromoAppliesTo = "pro_parent" | "coop_leader" | "kyc" | "event_boost" | "group_boost" | "all";

export interface PromoCode {
  id?: string;
  code: string;
  title: string;
  description: string;
  discountType: PromoDiscountType;
  percentOff: number | null;
  amountOff: number | null;
  appliesTo: PromoAppliesTo;
  maxRedemptions: number | null;
  redemptionCount: number;
  perUserLimit: number;
  startsAt: any | null;
  expiresAt: any | null;
  active: boolean;
  createdBy: string;
  createdAt: any;
  updatedAt: any;
}

export interface PromoRedemption {
  id?: string;
  promoCodeId: string;
  code: string;
  userId: string;
  userEmail: string;
  appliesTo: string;
  redeemedAt: any;
  stripeSessionId?: string;
  status: "pending" | "applied" | "failed";
}

export const promoService = {
  async createPromo(promo: Omit<PromoCode, "id" | "createdAt" | "updatedAt" | "redemptionCount">) {
    const promoId = promo.code.toUpperCase();
    const docRef = doc(db, "promoCodes", promoId);
    
    // Check if code exists
    const existing = await getDoc(docRef);
    if (existing.exists()) throw new Error("Promo code already exists");

    await setDoc(docRef, {
      ...promo,
      code: promo.code.toUpperCase(),
      redemptionCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return promoId;
  },

  async updatePromo(id: string, data: Partial<PromoCode>) {
    const docRef = doc(db, "promoCodes", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deletePromo(id: string) {
    await deleteDoc(doc(db, "promoCodes", id));
  },

  async getAllPromos() {
    const q = query(collection(db, "promoCodes"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PromoCode));
  },

  async getPromoByCode(code: string): Promise<PromoCode | null> {
    const docRef = doc(db, "promoCodes", code.toUpperCase());
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as PromoCode;
    }
    return null;
  },

  async getRedemptions(promoId?: string) {
    let q;
    if (promoId) {
      q = query(collection(db, "promoRedemptions"), where("promoCodeId", "==", promoId), orderBy("redeemedAt", "desc"));
    } else {
      q = query(collection(db, "promoRedemptions"), orderBy("redeemedAt", "desc"));
    }
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PromoRedemption));
  }
};

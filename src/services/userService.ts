import { db } from "@/lib/firebase/firestore";
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: "parent" | "coopLeader" | "admin" | "owner";
  city: string;
  state: string;
  zip: string;
  verifiedParent: boolean;
  verificationStatus: "unverified" | "payment_required" | "paid_pending_start" | "pending" | "verified" | "rejected";
  verificationProvider: "manual" | "didit" | null;
  diditSessionId: string | null;
  diditSessionToken: string | null;
  kycPaid: boolean;
  kycPaidAt: any | null;
  kycStripeSessionId: string | null;
  plan: "free" | "pro" | "leader";
  subscriptionStatus: "active" | "inactive" | "trial";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  aiUsageToday: number;
  aiUsageResetAt: any;
  referralCode: string;
  referredBy: string | null;
  referralCount: number;
  isLocalFounder: boolean;
  createdAt: any;
  updatedAt: any;
}

export const userService = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  },

  async updateProfile(uid: string, data: Partial<UserProfile>) {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async createProfile(uid: string, profile: Partial<UserProfile>) {
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, {
      uid,
      displayName: profile.displayName || "",
      email: profile.email || "",
      photoURL: profile.photoURL || "",
      role: profile.role || "parent",
      city: profile.city || "",
      state: profile.state || "",
      zip: profile.zip || "",
      verifiedParent: false,
      verificationStatus: "unverified",
      verificationProvider: null,
      diditSessionId: null,
      diditSessionToken: null,
      kycPaid: false,
      kycPaidAt: null,
      kycStripeSessionId: null,
      plan: "free",
      subscriptionStatus: "inactive",
      aiUsageToday: 0,
      aiUsageResetAt: serverTimestamp(),
      referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      referredBy: profile.referredBy || null,
      referralCount: 0,
      isLocalFounder: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },
  
  async getUserByReferralCode(code: string): Promise<UserProfile | null> {
    const { query, where, collection, getDocs, limit } = await import("firebase/firestore");
    const q = query(collection(db, "users"), where("referralCode", "==", code), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as UserProfile;
    }
    return null;
  },

  async checkAndSetLocalFounder(uid: string, city: string) {
    if (!city) return;
    const { query, where, collection, getDocs, limit } = await import("firebase/firestore");
    const q = query(collection(db, "users"), where("city", "==", city), limit(11));
    const querySnapshot = await getDocs(q);
    
    // If less than 10 users in city, this user can be a founder
    if (querySnapshot.size <= 10) {
      await this.updateProfile(uid, { isLocalFounder: true });
    }
  }
};

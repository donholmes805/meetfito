import { db } from "@/lib/firebase/firestore";
import { doc, getDoc, updateDoc, setDoc, serverTimestamp, collection, query, getDocs, orderBy, limit, where } from "firebase/firestore";

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
    
    if (querySnapshot.size <= 10) {
      await this.updateProfile(uid, { isLocalFounder: true });
    }
  },

  async getAllUsers(maxCount = 50): Promise<UserProfile[]> {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(maxCount));
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as UserProfile);
  },

  async searchUsers(searchTerm: string): Promise<UserProfile[]> {
    // Basic search by email (Firestore doesn't support full-text search easily without Algolia)
    // We'll search by exact email or try a range for name
    const q = query(
      collection(db, "users"), 
      where("email", "==", searchTerm.toLowerCase().trim()),
      limit(20)
    );
    const snap = await getDocs(q);
    
    if (snap.empty) {
      // Try searching by displayName (prefix search)
      const qName = query(
        collection(db, "users"),
        where("displayName", ">=", searchTerm),
        where("displayName", "<=", searchTerm + "\uf8ff"),
        limit(20)
      );
      const snapName = await getDocs(qName);
      return snapName.docs.map(doc => doc.data() as UserProfile);
    }
    
    return snap.docs.map(doc => doc.data() as UserProfile);
  }
};

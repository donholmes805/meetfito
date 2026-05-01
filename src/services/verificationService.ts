import { db } from "@/lib/firebase/firestore";
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  where,
  updateDoc
} from "firebase/firestore";
import { userService } from "./userService";

export interface VerificationRequest {
  id?: string;
  userId: string;
  userName: string;
  status: "unverified" | "pending" | "verified" | "rejected";
  provider: "manual" | "didit" | "stripeIdentity" | "persona";
  submittedAt: any;
  reviewedAt?: any;
  notes?: string;
}

export const verificationService = {
  async submitVerification(userId: string, userName: string) {
    const docRef = await addDoc(collection(db, "verifications"), {
      userId,
      userName,
      status: "pending",
      provider: "manual",
      submittedAt: serverTimestamp(),
    });

    // Also update the user's status in their profile
    await userService.updateProfile(userId, { verificationStatus: "pending" });

    return docRef.id;
  },

  async getPendingVerifications(): Promise<VerificationRequest[]> {
    const q = query(
      collection(db, "verifications"),
      where("status", "==", "pending"),
      orderBy("submittedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as VerificationRequest));
  },

  async approveVerification(id: string, userId: string) {
    const docRef = doc(db, "verifications", id);
    await updateDoc(docRef, {
      status: "verified",
      reviewedAt: serverTimestamp(),
    });

    await userService.updateProfile(userId, {
      verifiedParent: true,
      verificationStatus: "verified"
    });
  },

  async rejectVerification(id: string, userId: string, notes: string) {
    const docRef = doc(db, "verifications", id);
    await updateDoc(docRef, {
      status: "rejected",
      reviewedAt: serverTimestamp(),
      notes
    });

    await userService.updateProfile(userId, {
      verifiedParent: false,
      verificationStatus: "rejected"
    });
  }
};

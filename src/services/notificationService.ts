import { db } from "@/lib/firebase/firestore";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";

export interface FitoNotification {
  id?: string;
  userId: string;
  type: "event_near_me" | "group_approval" | "referral_success" | "system";
  message: string;
  link?: string;
  read: boolean;
  createdAt: any;
}

export const notificationService = {
  async createNotification(data: Omit<FitoNotification, "createdAt" | "read">) {
    const colRef = collection(db, "notifications");
    await addDoc(colRef, {
      ...data,
      read: false,
      createdAt: serverTimestamp(),
    });
  },

  async getUserNotifications(userId: string, count = 10): Promise<FitoNotification[]> {
    const colRef = collection(db, "notifications");
    const q = query(
      colRef, 
      where("userId", "==", userId), 
      orderBy("createdAt", "desc"), 
      limit(count)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FitoNotification));
  },

  async markAsRead(id: string) {
    const docRef = doc(db, "notifications", id);
    await updateDoc(docRef, { read: true });
  }
};

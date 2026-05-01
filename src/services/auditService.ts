import { db } from "@/lib/firebase/firestore";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, where } from "firebase/firestore";

export interface AuditLog {
  id?: string;
  actorId: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  before?: any;
  after?: any;
  metadata?: any;
  createdAt: any;
}

export const auditService = {
  async logAction(data: Omit<AuditLog, "createdAt" | "id">) {
    try {
      await addDoc(collection(db, "auditLogs"), {
        ...data,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to create audit log:", error);
    }
  },

  async getRecentLogs(maxCount = 50) {
    const q = query(
      collection(db, "auditLogs"),
      orderBy("createdAt", "desc"),
      limit(maxCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
  },

  async getTargetLogs(targetType: string, targetId: string) {
    const q = query(
      collection(db, "auditLogs"),
      where("targetType", "==", targetType),
      where("targetId", "==", targetId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
  }
};

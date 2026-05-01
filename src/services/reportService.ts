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

export interface SafetyReport {
  id?: string;
  reporterId: string;
  reporterName: string;
  targetType: "user" | "event" | "group";
  targetId: string;
  targetName: string;
  reason: string;
  description: string;
  status: "open" | "reviewed" | "resolved";
  createdAt: any;
}

export const reportService = {
  async submitReport(report: Omit<SafetyReport, "id" | "status" | "createdAt">) {
    const docRef = await addDoc(collection(db, "reports"), {
      ...report,
      status: "open",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getOpenReports(): Promise<SafetyReport[]> {
    const q = query(
      collection(db, "reports"),
      where("status", "==", "open"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SafetyReport));
  },

  async resolveReport(id: string) {
    const docRef = doc(db, "reports", id);
    await updateDoc(docRef, {
      status: "resolved",
    });
  }
};

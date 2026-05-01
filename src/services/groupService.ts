import { db } from "@/lib/firebase/firestore";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  serverTimestamp 
} from "firebase/firestore";

export interface FitoGroup {
  id?: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  city: string;
  state: string;
  visibility: "public" | "private";
  schedule: string;
  ageRange: string;
  subjects: string[];
  members: string[];
  pendingRequests: string[];
  boosted?: boolean;
  boostExpiresAt?: any;
  createdAt: any;
  updatedAt: any;
}

export const groupService = {
  async getAllGroups() {
    const q = query(collection(db, "groups"), where("visibility", "==", "public"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FitoGroup));
  },

  async getGroupById(id: string) {
    const docRef = doc(db, "groups", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FitoGroup;
    }
    return null;
  },

  async createGroup(group: Omit<FitoGroup, "id" | "createdAt" | "updatedAt">) {
    const docRef = await addDoc(collection(db, "groups"), {
      ...group,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async requestToJoin(groupId: string, userId: string, userName: string, ownerId: string) {
    await addDoc(collection(db, "groupRequests"), {
      groupId,
      requesterId: userId,
      requesterName: userName,
      ownerId,
      status: "pending",
      createdAt: serverTimestamp(),
    });
  },

  async updateGroup(id: string, data: Partial<FitoGroup>) {
    const docRef = doc(db, "groups", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteGroup(id: string) {
    const docRef = doc(db, "groups", id);
    await deleteDoc(docRef);
  }
};

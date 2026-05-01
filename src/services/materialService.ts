import { db } from "@/lib/firebase/firestore";
import { storage } from "@/lib/firebase/storage";
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface LearningMaterial {
  id?: string;
  title: string;
  description: string;
  category: string;
  subject: string;
  gradeLevel: string;
  fileUrl: string;
  fileType: string;
  accessLevel: "free" | "member" | "premium" | "coopOnly";
  uploadedBy: string;
  uploadedByRole?: string;
  createdAt: any;
  updatedAt: any;
}

export const materialService = {
  async getAllMaterials() {
    const q = query(collection(db, "materials"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LearningMaterial));
  },

  async getMaterialsByCategory(category: string) {
    const q = query(collection(db, "materials"), where("category", "==", category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LearningMaterial));
  },

  async uploadMaterial(file: File, materialData: Omit<LearningMaterial, "id" | "fileUrl" | "createdAt" | "updatedAt">) {
    // 1. Create document to get ID
    const docRef = await addDoc(collection(db, "materials"), {
      ...materialData,
      fileUrl: "", // Placeholder
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 2. Upload file to Storage
    const storageRef = ref(storage, `materials/${docRef.id}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(snapshot.ref);

    // 3. Update document with real URL
    await updateDoc(docRef, {
      fileUrl,
      fileType: file.type,
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  },

  async deleteMaterial(id: string) {
    const docRef = doc(db, "materials", id);
    await deleteDoc(docRef);
  }
};

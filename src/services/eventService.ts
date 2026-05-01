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
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";

export type EventType = "study" | "pe" | "park_day" | "field_trip" | "coop" | "social";
export type EventStatus = "active" | "pending" | "cancelled";

export interface FitoEvent {
  id?: string;
  title: string;
  description: string;
  boosted?: boolean;
  boostExpiresAt?: any;
  type: EventType;
  hostId: string;
  hostName: string;
  locationName: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  date: string;
  startTime: string;
  endTime: string;
  ageMin: number;
  ageMax: number;
  maxAttendees: number;
  approvalRequired: boolean;
  safetyNotes: string;
  status: EventStatus;
  attendees: string[];
  hostVerified?: boolean;
  createdAt: any;
  updatedAt: any;
}

export const eventService = {
  async getAllEvents() {
    const q = query(
      collection(db, "events"), 
      where("status", "==", "active"),
      orderBy("date", "asc")
    );
    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FitoEvent));
    
    // Sort: Boosted first, then Verified Hosts, then by date
    return events.sort((a, b) => {
      if (a.boosted && !b.boosted) return -1;
      if (!a.boosted && b.boosted) return 1;
      if (a.hostVerified && !b.hostVerified) return -1;
      if (!a.hostVerified && b.hostVerified) return 1;
      return 0;
    });
  },

  async getEventById(id: string) {
    const docRef = doc(db, "events", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FitoEvent;
    }
    return null;
  },

  async createEvent(event: Omit<FitoEvent, "id" | "createdAt" | "updatedAt">) {
    const docRef = await addDoc(collection(db, "events"), {
      ...event,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateEvent(id: string, data: Partial<FitoEvent>) {
    const docRef = doc(db, "events", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async requestToJoin(eventId: string, userId: string, userName: string, hostId: string) {
    await addDoc(collection(db, "eventRequests"), {
      eventId,
      requesterId: userId,
      requesterName: userName,
      hostId,
      status: "pending",
      createdAt: serverTimestamp(),
    });
  }
};

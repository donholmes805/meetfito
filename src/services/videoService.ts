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

export interface VideoRoom {
  id?: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  groupId?: string;
  eventId?: string;
  provider: "jitsi" | "livekit" | "daily" | "whereby";
  roomName: string;
  roomUrl: string;
  scheduledAt: any;
  status: "scheduled" | "live" | "ended";
  createdAt: any;
}

export const videoService = {
  async createRoom(room: Omit<VideoRoom, "id" | "createdAt" | "roomName" | "roomUrl" | "status">, idToken: string) {
    if (room.provider === "whereby") {
      const response = await fetch("/api/video/whereby/create-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify(room),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create video room");
      }

      const data = await response.json();
      return data.id;
    }

    const roomName = `meetfito-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const roomUrl = `https://meet.jit.si/${roomName}`;
    
    const docRef = await addDoc(collection(db, "videoRooms"), {
      ...room,
      roomName,
      roomUrl,
      status: "scheduled",
      createdAt: serverTimestamp(),
    });
    
    return docRef.id;
  },

  async getAllRooms(): Promise<VideoRoom[]> {
    const q = query(
      collection(db, "videoRooms"), 
      where("status", "in", ["scheduled", "live"]),
      orderBy("scheduledAt", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as VideoRoom));
  },

  async getRoom(id: string): Promise<VideoRoom | null> {
    const docRef = doc(db, "videoRooms", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as VideoRoom;
    }
    return null;
  },

  async updateRoomStatus(id: string, status: VideoRoom["status"]) {
    const docRef = doc(db, "videoRooms", id);
    await updateDoc(docRef, { status });
  }
};

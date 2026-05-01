import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const WHEREBY_API_KEY = process.env.WHEREBY_API_KEY;

export async function POST(req: NextRequest) {
  try {
    if (!WHEREBY_API_KEY) {
      return NextResponse.json({ error: "Whereby is not configured." }, { status: 503 });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Check if user is verified parent or admin
    const userSnap = await adminDb.collection("users").doc(userId).get();
    const userData = userSnap.data();

    if (!userData?.verifiedParent && userData?.role !== "admin" && userData?.role !== "owner") {
      return NextResponse.json({ error: "Only verified parents can host video rooms." }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, scheduledAt, eventId, groupId } = body;

    // Create Whereby Room
    const response = await fetch("https://api.whereby.dev/v1/meetings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHEREBY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isLocked: true,
        roomNamePrefix: "meetfito-",
        roomMode: "normal",
        startDate: scheduledAt,
        endDate: new Date(new Date(scheduledAt).getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours duration
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Whereby API error:", errorData);
      throw new Error("Failed to create Whereby room.");
    }

    const data = await response.json();
    const { meetingId, roomUrl, hostRoomUrl } = data;

    // Save to Firestore
    const roomRef = await adminDb.collection("videoRooms").add({
      title,
      description,
      hostId: userId,
      hostName: userData.displayName || "Parent",
      provider: "whereby",
      meetingId,
      roomUrl,
      hostRoomUrl,
      scheduledAt: new Date(scheduledAt),
      status: "scheduled",
      eventId: eventId || null,
      groupId: groupId || null,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: roomRef.id, roomUrl, hostRoomUrl });
  } catch (error: any) {
    console.error("Whereby create room error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";

const WHEREBY_WEBHOOK_SECRET = process.env.WHEREBY_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-whereby-signature");

    if (WHEREBY_WEBHOOK_SECRET && signature) {
      const hmac = crypto.createHmac("sha256", WHEREBY_WEBHOOK_SECRET);
      const digest = hmac.update(rawBody).digest("hex");

      if (digest !== signature) {
        console.warn("Invalid Whereby webhook signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const body = JSON.parse(rawBody);
    console.log("Whereby Webhook Event:", body);

    const { event, roomName } = body;

    if (!event || !roomName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Strip leading slash if present
    const normalizedRoomName = roomName.startsWith("/") ? roomName.slice(1) : roomName;

    // Find the room in Firestore
    const roomQuery = await adminDb.collection("videoRooms")
      .where("roomName", "==", normalizedRoomName)
      .limit(1)
      .get();

    if (roomQuery.empty) {
      console.warn(`No video room found for roomName: ${normalizedRoomName}`);
      return NextResponse.json({ received: true, warning: "Room not found" });
    }

    const roomDoc = roomQuery.docs[0];
    let newStatus: string | null = null;

    switch (event) {
      case "meeting.started":
        newStatus = "live";
        break;
      case "meeting.ended":
        newStatus = "ended";
        break;
      case "participant.joined":
        // Track attendance or active count if needed
        break;
      case "participant.left":
        // Track attendance or active count if needed
        break;
    }

    if (newStatus) {
      await roomDoc.ref.update({
        status: newStatus,
        updatedAt: FieldValue.serverTimestamp(),
        // If it just started, we might want to record the actual start time
        ...(newStatus === "live" ? { actualStartedAt: FieldValue.serverTimestamp() } : {}),
        ...(newStatus === "ended" ? { actualEndedAt: FieldValue.serverTimestamp() } : {}),
      });
      console.log(`Updated video room ${normalizedRoomName} status to ${newStatus}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Whereby Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed", details: error.message }, { status: 500 });
  }
}

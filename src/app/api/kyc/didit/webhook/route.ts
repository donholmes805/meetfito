import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";

const DIDIT_WEBHOOK_SECRET = process.env.DIDIT_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-didit-signature");

    if (DIDIT_WEBHOOK_SECRET && signature) {
      const hmac = crypto.createHmac("sha256", DIDIT_WEBHOOK_SECRET);
      const digest = hmac.update(rawBody).digest("hex");
      
      if (digest !== signature) {
        console.warn("Invalid Didit webhook signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const { session_id, status, decision, vendor_data: userId } = payload;

    if (!userId) {
      return NextResponse.json({ error: "No user reference found" }, { status: 400 });
    }

    const userRef = adminDb.collection("users").doc(userId);
    const verQuery = await adminDb.collection("verifications")
      .where("diditSessionId", "==", session_id)
      .limit(1)
      .get();

    let finalStatus: "verified" | "rejected" | "pending" = "pending";
    if (decision === "APPROVED" || status === "COMPLETED") {
      finalStatus = "verified";
    } else if (decision === "REJECTED" || status === "FAILED") {
      finalStatus = "rejected";
    }

    const updateData: any = {
      verificationStatus: finalStatus,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (finalStatus === "verified") {
      updateData.verifiedParent = true;
      updateData.verificationProvider = "didit";
    }

    await userRef.update(updateData);

    if (!verQuery.empty) {
      await verQuery.docs[0].ref.update({
        status: finalStatus,
        diditDecision: decision,
        diditRawStatus: status,
        updatedAt: FieldValue.serverTimestamp(),
        reviewedAt: finalStatus !== "pending" ? FieldValue.serverTimestamp() : null,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Didit Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const DIDIT_API_KEY = process.env.DIDIT_API_KEY;
const DIDIT_WORKFLOW_ID = process.env.DIDIT_WORKFLOW_ID;
const DIDIT_BASE_URL = process.env.DIDIT_BASE_URL || "https://verification.didit.me";

export async function POST(req: NextRequest) {
  try {
    if (!DIDIT_API_KEY || !DIDIT_WORKFLOW_ID) {
      return NextResponse.json({ error: "Didit verification is not configured yet." }, { status: 503 });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Check if user has paid
    const userSnap = await adminDb.collection("users").doc(userId).get();
    const userData = userSnap.data();

    if (!userData?.kycPaid) {
      return NextResponse.json({ error: "KYC payment required." }, { status: 403 });
    }

    if (userData.verifiedParent) {
      return NextResponse.json({ error: "User is already verified." }, { status: 400 });
    }

    // Create Didit Session
    const response = await fetch(`${DIDIT_BASE_URL}/v1/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": DIDIT_API_KEY,
      },
      body: JSON.stringify({
        workflow_id: DIDIT_WORKFLOW_ID,
        vendor_data: userId, // Pass userId as vendor_data to match in webhook
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/verify/status`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Didit session creation error:", errorData);
      throw new Error("Failed to create Didit session.");
    }

    const data = await response.json();
    const { session_id, session_token, verification_url } = data;

    // Save session info to Firestore
    await adminDb.collection("users").doc(userId).update({
      diditSessionId: session_id,
      diditSessionToken: session_token,
      verificationStatus: "pending",
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Update verifications record
    const verQuery = await adminDb.collection("verifications")
      .where("userId", "==", userId)
      .where("status", "==", "paid_pending_start")
      .limit(1)
      .get();

    if (!verQuery.empty) {
      await verQuery.docs[0].ref.update({
        diditSessionId: session_id,
        diditSessionToken: session_token,
        verificationUrl: verification_url,
        status: "pending",
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ verificationUrl: verification_url });
  } catch (error: any) {
    console.error("Didit KYC error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

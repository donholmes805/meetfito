import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia" as any,
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Stripe Webhook signature verification failed.", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      // 💰 PAYMENT SUCCESS (KYC or new subscription)
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const purpose = session.metadata?.purpose;

        if (!userId) {
          console.warn("Stripe Checkout completed without userId metadata.");
          break;
        }

        const userRef = adminDb.collection("users").doc(userId);

        if (purpose === "parent_identity_verification") {
          console.log("KYC payment complete for user:", userId);
          await userRef.update({
            kycPaid: true,
            kycPaidAt: FieldValue.serverTimestamp(),
            kycStripeSessionId: session.id,
            verificationStatus: "paid_pending_start",
          });

          // Track the verification record
          await adminDb.collection("verifications").add({
            userId,
            provider: "didit",
            status: "paid_pending_start",
            stripeSessionId: session.id,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });
        } else {
          // It's a subscription checkout
          console.log("Subscription payment complete for user:", userId);
          const subscriptionId = session.subscription as string;
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          // Map Stripe Price IDs to Meet Fito Plans
          let plan: "pro" | "leader" = "pro";
          const priceId = session.line_items?.data[0]?.price?.id;
          
          if (session.metadata?.plan === "leader" || priceId === process.env.STRIPE_PRICE_COOP_LEADER) {
            plan = "leader";
          }

          await userRef.update({
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: "active",
            plan: plan,
            updatedAt: FieldValue.serverTimestamp(),
          });
        }
        break;
      }

      // 🔁 SUBSCRIPTION CREATED / UPDATED
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        console.log(`Subscription ${event.type} for user: ${userId}`);
        const userRef = adminDb.collection("users").doc(userId);
        
        let plan: "pro" | "leader" = "pro";
        if (subscription.metadata?.plan === "leader") plan = "leader";

        await userRef.update({
          subscriptionStatus: subscription.status === "active" ? "active" : "inactive",
          plan: subscription.status === "active" ? plan : "free",
          updatedAt: FieldValue.serverTimestamp(),
        });
        break;
      }

      // ❌ SUBSCRIPTION CANCELED
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        console.log("Subscription canceled for user:", userId);
        const userRef = adminDb.collection("users").doc(userId);
        
        await userRef.update({
          plan: "free",
          subscriptionStatus: "inactive",
          updatedAt: FieldValue.serverTimestamp(),
        });
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error("Stripe Webhook handler failed:", error);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 });
  }
}

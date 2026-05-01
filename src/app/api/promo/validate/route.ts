import { NextResponse } from "next/server";
import { promoService } from "@/services/promoService";
import { userService } from "@/services/userService";

export async function POST(req: Request) {
  try {
    const { code, userId, appliesTo } = await req.json();

    if (!code || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const promo = await promoService.getPromoByCode(code);

    if (!promo || !promo.active) {
      return NextResponse.json({ valid: false, error: "Invalid or expired promo code" });
    }

    // Check expiration
    if (promo.expiresAt && promo.expiresAt.toDate() < new Date()) {
      return NextResponse.json({ valid: false, error: "Promo code has expired" });
    }

    // Check max redemptions
    if (promo.maxRedemptions && promo.redemptionCount >= promo.maxRedemptions) {
      return NextResponse.json({ valid: false, error: "Promo code has reached max usage" });
    }

    // Check applicability
    if (appliesTo && promo.appliesTo !== "all" && promo.appliesTo !== appliesTo) {
      return NextResponse.json({ valid: false, error: `This code is not valid for ${appliesTo.replace('_', ' ')}` });
    }

    // Check per-user limit
    const userRedemptions = await promoService.getRedemptions(promo.id!);
    const userCount = userRedemptions.filter(r => r.userId === userId).length;
    if (userCount >= promo.perUserLimit) {
      return NextResponse.json({ valid: false, error: "You have already used this promo code" });
    }

    return NextResponse.json({
      valid: true,
      promo: {
        id: promo.id,
        code: promo.code,
        discountType: promo.discountType,
        percentOff: promo.percentOff,
        amountOff: promo.amountOff,
        appliesTo: promo.appliesTo,
      }
    });

  } catch (error) {
    console.error("Promo validation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

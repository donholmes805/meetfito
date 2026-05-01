"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function InvitePage() {
  const router = useRouter();
  const params = useParams();
  const { code } = params;

  useEffect(() => {
    if (code) {
      localStorage.setItem("fito_referral_code", code as string);
    }
    router.push("/auth/signup");
  }, [code, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-on-surface-variant font-bold animate-pulse">Joining the Meet Fito community...</p>
      </div>
    </div>
  );
}

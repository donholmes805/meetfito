"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function VerifyStartPage() {
  const { user, profile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const startDidit = async () => {
      if (!user) return;
      
      try {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/kyc/didit/create-session", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${idToken}`,
          },
        });
        
        const data = await res.json();
        
        if (data.verificationUrl) {
          window.location.href = data.verificationUrl;
        } else {
          setError(data.error || "Failed to initialize verification.");
        }
      } catch (err) {
        console.error("Didit start error:", err);
        setError("Something went wrong. Please try again.");
      }
    };

    if (user) {
      startDidit();
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          {!error ? (
            <div className="space-y-6">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <h2 className="text-2xl font-bold">Preparing Verification...</h2>
              <p className="text-on-surface-variant">We're setting up your secure identity session. You'll be redirected to Didit in a moment.</p>
            </div>
          ) : (
            <div className="bg-red-50 p-8 rounded-[32px] border border-red-100">
              <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
              <h2 className="text-xl font-bold text-red-700 mb-2">Verification Error</h2>
              <p className="text-red-600 mb-6">{error}</p>
              <button 
                onClick={() => router.push("/verify")}
                className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold"
              >
                Go Back
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

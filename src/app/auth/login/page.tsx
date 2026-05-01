"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const { user, signInWithGoogle, loginWithEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-6 py-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-12 rounded-[48px] shadow-xl border border-outline-variant max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-primary text-4xl">diversity_3</span>
          </div>
          
          <h1 className="text-3xl font-extrabold text-on-background mb-2">Welcome Back</h1>
          <p className="text-on-surface-variant mb-8">Sign in to your Meet Fito account.</p>
          
          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-2xl mb-6 text-sm font-medium border border-error/20">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Button 
              onClick={signInWithGoogle} 
              variant="outline" 
              className="w-full flex items-center justify-center gap-3 py-4 border-outline-variant text-on-surface font-bold hover:bg-surface-container-low transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.5 0 19.5-7.6 19.5-20 0-1.3-.1-2.7-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 18.9 13 24 13c3 0 5.7 1.1 7.8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.2C29.2 35.5 26.7 36.5 24 36.5c-5.3 0-9.7-3.6-11.3-8.5l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.6 5.5-6.9 6.8l6.3 5.2C38.4 36.7 43.6 29.6 43.6 20.5z"/>
              </svg>
              Continue with Google
            </Button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-on-surface-variant font-bold tracking-widest">Or login with email</span></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2 px-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  required
                  className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2 px-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full py-4 shadow-lg">
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </div>
          
          <p className="mt-10 text-sm text-on-surface-variant font-medium">
            New to Meet Fito? <Link href="/auth/signup" className="text-primary font-bold hover:underline">Create an account</Link>
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

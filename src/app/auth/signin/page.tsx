"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignInPage() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  // If user is already logged in, redirect to home or profile
  React.useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

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
          
          <h1 className="text-3xl font-extrabold text-on-background mb-4">Welcome to Meet Fito</h1>
          <p className="text-on-surface-variant mb-10">Join our safe community of homeschool families today.</p>
          
          <div className="space-y-4">
            <Button 
              onClick={signInWithGoogle} 
              variant="outline" 
              className="w-full flex items-center justify-center gap-3 py-4 border-outline-variant text-on-surface font-bold hover:bg-surface-container-low transition-all"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </Button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-on-surface-variant font-bold tracking-widest">Or continue with</span></div>
            </div>

            <div className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2 px-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="parent@example.com"
                  className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2 px-1">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button className="w-full py-4 shadow-lg">Sign In</Button>
            </div>
          </div>
          
          <p className="mt-10 text-sm text-on-surface-variant font-medium">
            Don't have an account? <span className="text-primary font-bold cursor-pointer hover:underline">Create an account</span>
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

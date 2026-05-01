"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { usePathname } from "next/navigation";

import { isAdmin } from "@/lib/auth/rbac";
import { NotificationBell } from "./NotificationBell";

export const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="bg-surface/90 backdrop-blur-md sticky top-0 border-b border-outline-variant shadow-sm z-50">
      <div className="flex justify-between items-center w-full px-6 h-16 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">diversity_3</span>
          <span className="text-xl font-extrabold text-primary tracking-tight">Meet Fito</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/" 
            className={`${pathname === "/" ? "text-primary font-bold bg-primary-container/20" : "text-on-surface-variant"} hover:bg-primary-container/20 px-3 py-1 rounded-lg transition-colors font-medium`}
          >
            Home
          </Link>
          <Link 
            href="/discover" 
            className={`${pathname === "/discover" ? "text-primary font-bold bg-primary-container/20" : "text-on-surface-variant"} hover:bg-primary-container/20 px-3 py-1 rounded-lg transition-colors font-medium`}
          >
            Discover
          </Link>
          <Link 
            href="/groups" 
            className={`${pathname === "/groups" ? "text-primary font-bold bg-primary-container/20" : "text-on-surface-variant"} hover:bg-primary-container/20 px-3 py-1 rounded-lg transition-colors font-medium`}
          >
            Groups
          </Link>
          <Link 
            href="/learning" 
            className={`${pathname === "/learning" ? "text-primary font-bold bg-primary-container/20" : "text-on-surface-variant"} hover:bg-primary-container/20 px-3 py-1 rounded-lg transition-colors font-medium`}
          >
            Learning
          </Link>
          <Link 
            href="/video" 
            className={`${pathname === "/video" ? "text-primary font-bold bg-primary-container/20" : "text-on-surface-variant"} hover:bg-primary-container/20 px-3 py-1 rounded-lg transition-colors font-medium`}
          >
            Video
          </Link>
          {isAdmin(profile) && (
            <Link 
              href="/admin" 
              className={`${pathname === "/admin" ? "text-primary font-bold bg-primary-container/20" : "text-on-surface-variant"} hover:bg-primary-container/20 px-3 py-1 rounded-lg transition-colors font-medium`}
            >
              Admin
            </Link>
          )}
        </nav>

        {user ? (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('toggleFitoGuide'))}
              className="hidden sm:block text-on-surface-variant font-bold px-4 py-2 hover:text-primary transition-colors"
            >
              Ask Fito Guide
            </button>
            <NotificationBell />
            <Link href="/profile" className="flex items-center gap-3 bg-surface-container hover:bg-surface-container-high px-4 py-2 rounded-2xl border border-outline-variant transition-all">
              <span className="text-sm font-bold text-on-surface-variant hidden lg:block">My Account</span>
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border-2 border-primary/20"
              />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button className="hidden sm:block text-on-surface-variant font-bold px-4 py-2 hover:text-primary transition-colors">
              Ask Fito Guide
            </button>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/signup" className="hidden sm:block">
              <Button size="sm">Join Now</Button>
            </Link>
          </div>
        )}
        </div>
    </header>
  );
};

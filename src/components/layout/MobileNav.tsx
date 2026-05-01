"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const MobileNav = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: "home" },
    { label: "Discover", href: "/discover", icon: "explore" },
    { label: "Groups", href: "/groups", icon: "groups" },
    { label: "Learning", href: "/learning", icon: "school" },
    { label: "Video", href: "/video", icon: "videocam" },
    { label: "Profile", href: "/profile", icon: "person" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-t border-outline-variant px-2 py-3 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`relative flex flex-col items-center gap-1 min-w-[64px] transition-colors ${
                isActive ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? "fill-1" : ""}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-3 w-12 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

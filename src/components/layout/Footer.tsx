import React from "react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-surface-container-high py-12 mt-12 pb-32 md:pb-12 border-t border-outline-variant">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">diversity_3</span>
            <span className="text-lg font-extrabold text-primary">Meet Fito</span>
          </div>
          <p className="text-on-surface-variant text-sm max-w-xs leading-relaxed">
            Connecting families to create better, safer, and more social homeschooling experiences for the next generation.
          </p>
          <p className="text-on-surface-variant text-xs mt-4">
            By Fito Technology, LLC.
          </p>
        </div>
        <div>
          <h5 className="font-bold mb-4">Platform</h5>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li><Link href="/discover" className="hover:text-primary transition-colors">Find Groups</Link></li>
            <li><Link href="/groups/create" className="hover:text-primary transition-colors">Start a Co-Op</Link></li>
            <li><Link href="/safety" className="hover:text-primary transition-colors">Safety Guidelines</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">Community</h5>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li><Link href="/stories" className="hover:text-primary transition-colors">Parent Stories</Link></li>
            <li><Link href="/learning" className="hover:text-primary transition-colors">Resource Hub</Link></li>
            <li><Link href="/support" className="hover:text-primary transition-colors">Support</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between text-[11px] font-medium text-on-surface-variant/60 gap-4 uppercase tracking-widest">
        <p>© 2026 Meet Fito. All rights reserved. By Fito Technology, LLC.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
          <Link href="/cookies" className="hover:text-primary">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
};

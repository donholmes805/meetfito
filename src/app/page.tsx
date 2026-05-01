"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-24 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 bg-surface-container px-4 py-1.5 rounded-full border border-surface-container-highest"
          >
            <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Trusted by 5,000+ Homeschool Families</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-on-background mb-6 max-w-3xl leading-tight"
          >
            Homeschool Meetups <span className="text-primary">Made Simple</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-on-surface-variant mb-10 max-w-2xl"
          >
            Find families nearby, create study groups, organize P.E. days, and build safe homeschool co-ops in a community built specifically for parents.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button size="lg" variant="secondary" className="shadow-lg" asChild>
              <Link href="/discover">Find Meetups</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-secondary text-secondary" asChild>
              <Link href="/groups/create">Create a Group</Link>
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 w-full relative group"
          >
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[80%] bg-secondary/5 rounded-[100px] blur-3xl"></div>
            <div className="w-full aspect-[21/9] overflow-hidden rounded-[32px] shadow-2xl border-4 border-white bg-surface-container-low flex items-center justify-center relative">
              <img 
                src="/images/hero.png" 
                alt="Diverse homeschool families meeting at a park" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </motion.div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-24 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold text-on-background mb-3">Built for Your Lifestyle</h2>
                <p className="text-on-surface-variant">Everything you need to organize your homeschooling social calendar in one beautiful space.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Local Discovery */}
              <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant group overflow-hidden flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-primary-container rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <span className="material-symbols-outlined text-on-primary-container">location_on</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Local Family Discovery</h3>
                  <p className="text-on-surface-variant mb-6">Find families in your immediate neighborhood with children of similar ages and interests.</p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-secondary font-semibold">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span className="text-sm">Verified Local Parents</span>
                    </li>
                    <li className="flex items-center gap-2 text-secondary font-semibold">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span className="text-sm">Age-Match Filtering</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1 bg-surface-container-low rounded-2xl min-h-[200px] flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                   <img 
                    src="/images/local-discovery.png" 
                    alt="Families connecting in a park" 
                    className="absolute inset-0 w-full h-full object-cover"
                   />
                </div>
              </div>

              {/* Study Meetups */}
              <div className="md:col-span-4 bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-tertiary-container/30 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary">menu_book</span>
                  </div>
                  <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm">
                    <img src="/images/study-meetup.png" alt="Study meetup" className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Study Meetups</h3>
                <p className="text-on-surface-variant text-sm mb-6">Coordinate library days and focus sessions for various subjects and age groups.</p>
                <div className="mt-auto pt-6 border-t border-outline-variant/30 flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                      P{i}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-secondary/10 flex items-center justify-center text-[10px] font-bold text-secondary">+12</div>
                </div>
              </div>

              {/* P.E. & Park Days */}
              <div className="md:col-span-4 bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-secondary-container rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-container">park</span>
                  </div>
                  <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm">
                    <img src="/images/pe-park-day.png" alt="P.E. day" className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">P.E. & Park Days</h3>
                <p className="text-on-surface-variant text-sm">Organize outdoor activities, group sports, and social park dates for physical development.</p>
              </div>

              {/* Co-Ops */}
              <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant group overflow-hidden flex flex-col md:flex-row-reverse gap-8">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-surface-container-highest rounded-2xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary">groups</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Homeschool Co-Ops</h3>
                  <p className="text-on-surface-variant mb-6">Build long-term learning cooperatives where parents share teaching responsibilities.</p>
                  <div className="flex items-center gap-4 text-sm font-bold text-secondary">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">event_note</span> Manage Schedules</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">how_to_reg</span> Track Attendance</span>
                  </div>
                </div>
                <div className="flex-1 bg-surface-container-low rounded-2xl min-h-[200px] flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                   <img 
                    src="/images/coop.png" 
                    alt="Homeschool Co-Op activity" 
                    className="absolute inset-0 w-full h-full object-cover"
                   />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Section */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="bg-surface-container-low rounded-[48px] p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent -z-10"></div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-6">
                  <span className="material-symbols-outlined text-primary text-sm">shield</span>
                  <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Safety First</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Safe Groups for Peace of Mind</h2>
                <p className="text-on-surface-variant mb-8 leading-relaxed">
                  We understand that safety is your top priority. Meet Fito is built with a unique multi-step verification process designed specifically for the homeschool community.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex-shrink-0 flex items-center justify-center shadow-sm overflow-hidden">
                      <span className="material-symbols-outlined text-secondary">fingerprint</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-on-background">Parent ID Verification</h4>
                      <p className="text-sm text-on-surface-variant">Secure identity checks to confirm all users are genuine parents within the community.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex-shrink-0 flex items-center justify-center shadow-sm overflow-hidden">
                      <span className="material-symbols-outlined text-secondary">security</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-on-background">Private Group Chat</h4>
                      <p className="text-sm text-on-surface-variant">Encrypted messaging for coordinating logistics and sharing sensitive location details.</p>
                    </div>
                  </div>
                </div>
              </div>
              
               <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10 group-hover:bg-primary/30 transition-all"></div>
                <div className="bg-white rounded-[40px] p-2 shadow-2xl border border-outline-variant relative overflow-hidden aspect-[4/5] md:aspect-square">
                  <img 
                    src="/images/safety.png" 
                    alt="Safe parent-child interaction" 
                    className="w-full h-full object-cover rounded-[32px]"
                  />
                  <div className="absolute bottom-6 left-6 right-6 glass p-6 rounded-3xl border border-white/40 shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-white">verified_user</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-on-background">Trust & Safety</h5>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Verified Community</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 text-center max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Community?</h2>
          <p className="text-on-surface-variant mb-10 text-lg">
            Join thousands of parents who are already making homeschooling more social, safe, and fun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="primary" asChild>
              <Link href="/auth/signup">Get Started Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/safety">Learn More</Link>
            </Button>
          </div>
        </section>
      </main>



      <Footer />
    </div>
  );
}

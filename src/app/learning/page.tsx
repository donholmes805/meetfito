"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { materialService, LearningMaterial } from "@/services/materialService";
import { isFirebaseConfigValid } from "@/lib/firebase/client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthAppShell } from "@/components/layout/AuthAppShell";

const CATEGORIES = [
  { name: "Math", icon: "calculate", color: "bg-blue-50 text-blue-700 border-blue-100" },
  { name: "Reading", icon: "auto_stories", color: "bg-amber-50 text-amber-700 border-amber-100" },
  { name: "Science", icon: "biotech", color: "bg-green-50 text-green-700 border-green-100" },
  { name: "History", icon: "history_edu", color: "bg-red-50 text-red-700 border-red-100" },
  { name: "P.E.", icon: "fitness_center", color: "bg-purple-50 text-purple-700 border-purple-100" },
  { name: "Life Skills", icon: "psychology", color: "bg-teal-50 text-teal-700 border-teal-100" },
];

const MOCK_MATERIALS = [
  {
    id: "1",
    title: "Intro to Fractions Workbook",
    subject: "Math",
    gradeLevel: "3rd - 5th",
    fileType: "application/pdf",
    uploadedBy: "Meet Fito Team",
  },
  {
    id: "2",
    title: "Nature Scavenger Hunt",
    subject: "Science",
    gradeLevel: "All Ages",
    fileType: "text/plain",
    uploadedBy: "Sarah Jenkins",
  },
  {
    id: "3",
    title: "US History Timeline Project",
    subject: "History",
    gradeLevel: "6th - 8th",
    fileType: "application/vnd.ms-excel",
    uploadedBy: "History Co-Op",
  }
];

export default function LearningHubPage() {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        if (!isFirebaseConfigValid) {
          setMaterials(MOCK_MATERIALS as any);
          setLoading(false);
          return;
        }
        
        const data = await materialService.getAllMaterials();
        if (data.length === 0 && process.env.NODE_ENV === "development") {
          setMaterials(MOCK_MATERIALS as any);
        } else {
          setMaterials(data);
        }
      } catch (error) {
        console.error("Failed to fetch materials:", error);
        setMaterials(MOCK_MATERIALS as any);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);
  
  const filteredMaterials = selectedCategory === "All" 
    ? materials 
    : materials.filter(m => (m as any).category === selectedCategory || m.subject === selectedCategory);

  return (
    <ProtectedRoute>
      <AuthAppShell>
        <div className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-black mb-4 tracking-tight text-on-surface">Learning Hub</h1>
              <p className="text-on-surface-variant text-lg font-medium leading-relaxed">Access a library of shared materials, curriculum reviews, and homeschool resources.</p>
            </div>
            <Button className="rounded-3xl h-16 px-10 shadow-xl shadow-primary/20 text-lg font-black flex items-center gap-2">
              <span className="material-symbols-outlined font-black">upload</span>
              Upload Material
            </Button>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-16">
            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => setSelectedCategory("All")}
              className={`p-6 rounded-[32px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all border-2 ${
                selectedCategory === "All" 
                  ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
                  : "bg-white text-on-surface-variant border-outline-variant hover:border-primary/30"
              }`}
            >
              <span className={`material-symbols-outlined text-3xl ${selectedCategory === "All" ? "fill-1" : ""}`}>grid_view</span>
              <span className="font-black text-[10px] uppercase tracking-widest text-center">All</span>
            </motion.div>
            {CATEGORIES.map((cat) => (
              <motion.div
                key={cat.name}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedCategory(cat.name)}
                className={`p-6 rounded-[32px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all border-2 ${
                  selectedCategory === cat.name 
                    ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
                    : `bg-white ${cat.color.split(' ')[1]} ${cat.color.split(' ')[2]} hover:border-primary/30`
                }`}
              >
                <span className={`material-symbols-outlined text-3xl ${selectedCategory === cat.name ? "fill-1" : ""}`}>{cat.icon}</span>
                <span className="font-black text-[10px] uppercase tracking-widest text-center">{cat.name}</span>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-on-surface">
                <span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">new_releases</span>
                </span>
                Recently Added
              </h2>
              <div className="space-y-4">
                {loading ? (
                  <div className="py-20 text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-on-surface-variant font-bold">Fetching materials...</p>
                  </div>
                ) : filteredMaterials.length > 0 ? (
                  filteredMaterials.map((material) => (
                    <div 
                      key={material.id}
                      className="bg-white p-6 rounded-[32px] border border-outline-variant flex items-center justify-between hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-surface-container rounded-[24px] flex items-center justify-center border border-outline-variant/30">
                          <span className="material-symbols-outlined text-primary text-3xl">
                            {material.fileType?.includes('pdf') ? 'picture_as_pdf' : 'description'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-black text-lg group-hover:text-primary transition-colors leading-tight">{material.title}</h4>
                          <p className="text-sm text-on-surface-variant font-bold mt-1">
                            {material.subject} • {material.gradeLevel} • <span className="text-primary/70">By {material.uploadedBy}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-[9px] font-black bg-surface-container px-4 py-2 rounded-xl text-on-surface-variant uppercase tracking-[0.2em] border border-outline-variant/30">
                          {material.fileType?.split('/')?.[1]?.toUpperCase() || 'DOC'}
                        </span>
                        {material.fileUrl ? (
                          <a 
                            href={material.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-primary/20"
                          >
                            <span className="material-symbols-outlined text-2xl font-black">download</span>
                          </a>
                        ) : (
                          <button 
                            disabled
                            className="w-14 h-14 rounded-2xl bg-surface-container text-on-surface-variant/30 flex items-center justify-center border border-outline-variant cursor-not-allowed"
                          >
                            <span className="material-symbols-outlined text-2xl font-black">lock</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-12 rounded-[48px] border-2 border-dashed border-outline-variant text-center">
                    <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
                    </div>
                    <p className="text-on-surface-variant font-black text-xl">No materials found</p>
                    <p className="text-sm text-on-surface-variant/70 mt-2 font-medium">Try selecting a different category or upload your own!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-gradient-to-br from-primary to-primary-dark rounded-[40px] p-8 text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                  Fito Guide AI
                </h3>
                <p className="text-sm text-white/80 mb-8 leading-relaxed font-bold">
                  Need help finding the right curriculum? Ask Fito Guide for personalized recommendations based on your child's learning style.
                </p>
                <Button className="w-full bg-white text-primary rounded-2xl h-14 font-black hover:bg-white/90 shadow-xl shadow-black/10">Ask AI Assistant</Button>
              </div>
              
              <div className="bg-white rounded-[40px] p-8 border-2 border-outline-variant relative overflow-hidden">
                <div className="absolute top-0 right-0 px-4 py-2 bg-secondary text-on-secondary text-[10px] font-black rounded-bl-3xl uppercase tracking-widest">Premium</div>
                <h3 className="text-2xl font-black text-on-surface mb-4">Pro Materials</h3>
                <p className="text-sm text-on-surface-variant mb-8 font-medium leading-relaxed">
                  Get access to exclusive curriculum paths, printable planners, and expert-led planning tools.
                </p>
                <Button variant="outline" className="w-full border-2 border-primary text-primary rounded-2xl h-14 font-black hover:bg-primary/5">Upgrade to Premium</Button>
              </div>
            </div>
          </div>
        </div>
      </AuthAppShell>
    </ProtectedRoute>
  );
}

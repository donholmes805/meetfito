"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { materialService, LearningMaterial } from "@/services/materialService";
import { isFirebaseConfigValid } from "@/lib/firebase/client";

const CATEGORIES = [
  { name: "Math", icon: "calculate", color: "bg-blue-100 text-blue-700" },
  { name: "Reading", icon: "auto_stories", color: "bg-amber-100 text-amber-700" },
  { name: "Science", icon: "biotech", color: "bg-green-100 text-green-700" },
  { name: "History", icon: "history_edu", color: "bg-red-100 text-red-700" },
  { name: "P.E.", icon: "fitness_center", color: "bg-purple-100 text-purple-700" },
  { name: "Life Skills", icon: "psychology", color: "bg-teal-100 text-teal-700" },
];

const MOCK_MATERIALS = [
  {
    id: "1",
    title: "Intro to Fractions Workbook",
    subject: "Math",
    grade: "3rd - 5th",
    type: "PDF",
    author: "Meet Fito Team",
  },
  {
    id: "2",
    title: "Nature Scavenger Hunt",
    subject: "Science",
    grade: "All Ages",
    type: "Document",
    author: "Sarah Jenkins",
  },
  {
    id: "3",
    title: "US History Timeline Project",
    subject: "History",
    grade: "6th - 8th",
    type: "Template",
    author: "History Co-Op",
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
    : materials.filter(m => m.category === selectedCategory || m.subject === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold mb-4">Learning Hub</h1>
            <p className="text-on-surface-variant text-lg">Access a library of shared materials, curriculum reviews, and homeschool resources.</p>
          </div>
          <Button variant="primary" size="lg" className="flex items-center gap-2">
            <span className="material-symbols-outlined">upload</span>
            Upload Material
          </Button>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedCategory("All")}
            className={`p-6 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:shadow-md border-2 ${
              selectedCategory === "All" ? "bg-primary text-on-primary border-primary" : "bg-white text-on-surface-variant border-outline-variant"
            }`}
          >
            <span className="material-symbols-outlined text-3xl">grid_view</span>
            <span className="font-bold text-sm">All</span>
          </motion.div>
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.name}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedCategory(cat.name)}
              className={`p-6 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:shadow-md border-2 ${
                selectedCategory === cat.name ? "bg-primary text-on-primary border-primary" : `bg-white ${cat.color.split(' ')[1]} border-outline-variant`
              }`}
            >
              <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
              <span className="font-bold text-sm">{cat.name}</span>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">new_releases</span>
              Recently Added
            </h2>
            <div className="space-y-4">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-on-surface-variant text-sm font-medium">Fetching materials...</p>
                </div>
              ) : filteredMaterials.length > 0 ? (
                filteredMaterials.map((material) => (
                  <div 
                    key={material.id}
                    className="bg-white p-6 rounded-3xl border border-outline-variant flex items-center justify-between hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl">
                          {material.fileType?.includes('pdf') ? 'picture_as_pdf' : 'description'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{material.title}</h4>
                        <p className="text-sm text-on-surface-variant font-medium">
                          {material.subject} • {material.gradeLevel} • By {material.uploadedBy}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold bg-surface-container px-3 py-1.5 rounded-lg text-on-surface-variant uppercase tracking-wider">
                        {material.fileType?.split('/')?.[1]?.toUpperCase() || 'DOC'}
                      </span>
                      {material.fileUrl && (
                        <a 
                          href={material.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full border-2 border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                        >
                          <span className="material-symbols-outlined text-xl">download</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-surface-container-low p-12 rounded-[32px] border-2 border-dashed border-outline-variant text-center">
                  <span className="material-symbols-outlined text-5xl text-outline mb-4">search_off</span>
                  <p className="text-on-surface-variant font-bold">No materials found in this category.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant mb-8">
              <h3 className="text-xl font-bold mb-4">Fito Guide AI</h3>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                Need help finding the right curriculum? Ask Fito Guide for personalized recommendations based on your child's learning style.
              </p>
              <Button variant="secondary" className="w-full">Ask Fito Guide</Button>
            </div>
            
            <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
              <h3 className="text-xl font-bold text-primary mb-4">Premium Materials</h3>
              <p className="text-sm text-on-surface-variant mb-6">
                Get access to exclusive curriculum paths and expert-led planning tools.
              </p>
              <Button variant="outline" className="w-full border-primary text-primary">Upgrade to Premium</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

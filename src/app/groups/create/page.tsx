"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CreateGroupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    schedule: "",
    location: "",
    visibility: "Public",
    subjects: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock save to Firestore
    console.log("Saving group:", formData);
    setTimeout(() => {
      setLoading(false);
      router.push("/groups");
    }, 1000);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-surface-container-lowest">
        <Navbar />
        
        <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold mb-4">Start a Community</h1>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
              Create a space for long-term collaboration, shared learning, and community building.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-12 rounded-[48px] border border-outline-variant shadow-xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2 px-1">Group Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Westside Science Co-Op"
                  className="w-full px-6 py-5 bg-surface-container-lowest border border-outline-variant rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-2 px-1">Description</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="What is the mission of this group? Who should join?"
                  className="w-full px-6 py-5 bg-surface-container-lowest border border-outline-variant rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2 px-1">Location / Area</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Santa Monica"
                    className="w-full px-6 py-5 bg-surface-container-lowest border border-outline-variant rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2 px-1">Schedule</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Tuesdays 10am-2pm"
                    className="w-full px-6 py-5 bg-surface-container-lowest border border-outline-variant rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.schedule}
                    onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2 px-1">Primary Subjects</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Art, Math, Nature"
                    className="w-full px-6 py-5 bg-surface-container-lowest border border-outline-variant rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.subjects}
                    onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2 px-1">Privacy</label>
                  <select 
                    className="w-full px-6 py-5 bg-surface-container-lowest border border-outline-variant rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                    value={formData.visibility}
                    onChange={(e) => setFormData({...formData, visibility: e.target.value})}
                  >
                    <option>Public</option>
                    <option>Private (Invite Only)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 py-6 rounded-2xl border-2"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 py-6 rounded-2xl shadow-xl shadow-primary/20"
              >
                {loading ? "Creating..." : "Launch Group"}
              </Button>
            </div>
          </form>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}

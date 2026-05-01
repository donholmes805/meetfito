"use client";

import React, { useEffect, useState } from "react";
import { materialService, LearningMaterial } from "@/services/materialService";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { auditService } from "@/services/auditService";

export const LearningMaterialsTab = () => {
  const { profile: adminProfile } = useAuth();
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const data = await materialService.getAllMaterials();
      setMaterials(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteMaterial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this learning material?")) return;
    try {
      await materialService.deleteMaterial(id);
      await auditService.logAction({
        actorId: adminProfile?.uid!,
        actorEmail: adminProfile?.email!,
        actorRole: adminProfile?.role!,
        action: "DELETE_MATERIAL",
        targetType: "material",
        targetId: id,
      });
      fetchMaterials();
    } catch (e) {
      alert("Failed to delete material.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Learning Materials</h2>
        <Button variant="outline" onClick={fetchMaterials} className="rounded-2xl border-2">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant font-bold">Loading materials...</div>
        ) : materials.length === 0 ? (
          <div className="p-20 bg-white rounded-[40px] border border-outline-variant text-center">
            <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">menu_book</span>
            <p className="text-xl font-bold text-on-surface-variant">No materials found.</p>
          </div>
        ) : (
          materials.map((material) => (
            <div 
              key={material.id}
              className="bg-white p-6 rounded-[32px] border border-outline-variant flex items-center justify-between hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    {material.fileType?.includes('pdf') ? 'picture_as_pdf' : 'description'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{material.title}</h4>
                  <div className="flex gap-4 mt-1">
                    <p className="text-sm text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">
                      {material.subject} • {material.gradeLevel}
                    </p>
                    <p className="text-sm text-on-surface-variant font-bold uppercase tracking-widest text-[10px] opacity-60">
                      By {material.uploadedBy} {material.uploadedByRole ? `(${material.uploadedByRole})` : ''}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right mr-4">
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">Status</p>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">Live</span>
                </div>
                <a 
                  href={material.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl border-2 border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">download</span>
                </a>
                <button 
                  onClick={() => deleteMaterial(material.id!)}
                  className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center hover:bg-red-200 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

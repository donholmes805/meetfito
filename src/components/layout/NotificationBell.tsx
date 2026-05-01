"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { notificationService, FitoNotification } from "@/services/notificationService";
import { motion, AnimatePresence } from "framer-motion";

export const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<FitoNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    
    const fetchNotifications = async () => {
      const data = await notificationService.getUserNotifications(user.uid);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    };

    fetchNotifications();
    // In a real app, use onSnapshot for real-time
  }, [user]);

  const handleRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors relative"
      >
        <span className="material-symbols-outlined text-on-surface">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-[24px] shadow-2xl border border-outline-variant z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-outline-variant bg-surface-container-lowest">
              <h3 className="font-bold text-sm">Notifications</h3>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant text-xs font-medium">
                  No new notifications.
                </div>
              ) : (
                notifications.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => handleRead(n.id!)}
                    className={`p-4 border-b border-outline-variant last:border-0 hover:bg-surface-container transition-colors cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`}
                  >
                    <p className="text-xs text-on-surface leading-relaxed mb-1">{n.message}</p>
                    <span className="text-[10px] text-on-surface-variant opacity-60">
                      {n.createdAt?.toDate?.().toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

import { FitoEvent } from "@/services/eventService";

interface DiscoveryMapProps {
  events?: FitoEvent[];
  center?: [number, number];
  zoom?: number;
}

export const DiscoveryMap = ({ 
  events = [], 
  center = [40.7128, -74.006], 
  zoom = 11 
}: DiscoveryMapProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Fix for Leaflet marker icons in Next.js
    const L = require("leaflet");
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-surface-container-low flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl text-primary/20">map</span>
          <p className="text-on-surface-variant/40 font-bold">Initializing Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border border-outline-variant shadow-inner">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((event) => {
          if (!event.lat || !event.lng) return null;
          return (
            <Marker key={event.id} position={[event.lat, event.lng]}>
              <Popup>
                <div className="p-2 min-w-[150px]">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">{event.type}</p>
                  <h4 className="font-bold text-sm mb-1">{event.title}</h4>
                  <p className="text-xs text-on-surface-variant mb-2">{event.locationName}</p>
                  <a href={`/events/${event.id}`} className="text-xs font-bold text-secondary hover:underline">View Event</a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

import React from "react";
import { Metadata } from "next";
import { eventService } from "@/services/eventService";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const event = await eventService.getEventById(params.id);
  if (!event) return { title: "Event Not Found - Meet Fito" };

  return {
    title: `${event.title} - Meet Fito`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      type: "website",
      url: `https://meetfito.com/events/${event.id}`,
    },
  };
}

export default async function EventDetailPage({ params }: any) {
  const event = await eventService.getEventById(params.id);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
            <Button asChild><a href="/events">Back to Events</a></Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-12">
        <div className="bg-white rounded-[48px] overflow-hidden border border-outline-variant shadow-xl">
          <div className="p-10 md:p-16">
            <div className="flex flex-wrap gap-4 mb-8">
              <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
                {event.type.replace('_', ' ')}
              </span>
              {event.boosted && (
                <span className="px-4 py-1.5 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">rocket_launch</span>
                  Boosted
                </span>
              )}
            </div>

            <h1 className="text-5xl font-black mb-6 leading-tight text-on-surface">{event.title}</h1>
            
            <div className="flex flex-col md:flex-row gap-8 mb-12 py-8 border-y border-outline-variant">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">calendar_today</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Date</p>
                  <p className="font-bold">{typeof event.date === 'string' ? event.date : (event.date as any)?.toDate?.().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Location</p>
                  <p className="font-bold">{event.city}, {event.state}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">person</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Host</p>
                  <p className="font-bold">{event.hostName}</p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none mb-12">
              <h3 className="text-2xl font-bold mb-4">About this meetup</h3>
              <p className="text-on-surface-variant leading-relaxed text-lg">
                {event.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-outline-variant">
              <Button className="h-16 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 flex-grow sm:flex-grow-0">
                Join this Meetup
              </Button>
              <Button 
                variant="outline" 
                className="h-16 px-8 rounded-2xl font-bold border-2 flex items-center gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
              >
                <span className="material-symbols-outlined">share</span>
                Share
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

# Meet Fito - Production-Ready MVP

Meet Fito is a family-safe homeschool meetup platform where parents can find other homeschool families, create local study meetups, organize P.E. and park days, build homeschool co-ops, access learning materials, and use AI-powered planning tools.

## Project Details
- **Website**: https://meetfito.com
- **Company**: Fito Technology, LLC

## Core Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: OpenRouter API (Gemini 2.0 Flash)
- **Maps**: OpenStreetMap Placeholder (Leaflet/MapLibre ready)

## Implemented Pages & Features
1.  **Landing Page**: Polished public homepage with features overview and branding.
2.  **Authentication**: Firebase-ready Google and Email/Password sign-in.
3.  **Parent Dashboard**: Profile management for parents and children.
4.  **Discover**: Searchable meetup listings with category filters and map integration.
5.  **Groups & Co-Ops**: Listing of local homeschool cooperatives.
6.  **Learning Hub**: Resource library for sharing educational materials.
7.  **Video Meetups**: Placeholder system for parent planning sessions (Jitsi/LiveKit ready).
8.  **Safety & Verification**: Multi-step verification structure and safety guidelines.
9.  **Admin Dashboard**: Platform analytics and management interface.
10. **Fito Guide AI**: AI assistant integrated via API route.

## Environment Variables Needed
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
OPENROUTER_API_KEY=
NEXT_PUBLIC_SITE_URL=https://meetfito.com
```

## Firebase Collections Used
- `users`: Parent profiles and roles.
- `children`: (Subcollection of users) Child profiles and interests.
- `events`: Meetup details and attendee tracking.
- `groups`: Co-op and group details.
- `materials`: Learning hub resources.
- `verification`: Safety verification status.
- `videoRooms`: Video session metadata.

## Next Steps
1.  **Firebase Deployment**: Run `firebase deploy` to push rules and hosting.
2.  **OpenRouter Key**: Add `OPENROUTER_API_KEY` to `.env.local` to enable Fito Guide.
3.  **Maps Integration**: Replace the map placeholder with `react-leaflet` or `maplibre-gl`.
4.  **Video API**: Integrate Jitsi or LiveKit into the `videoRooms` system.
5.  **Verification API**: Connect a KYC provider like Didit or Stripe Identity.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

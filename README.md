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
2.  **Authentication**: Firebase Google and Email/Password sign-in with RBAC.
3.  **Parent Dashboard**: Profile management for parents and children.
4.  **Discover**: Searchable meetup listings with category filters and integrated OpenStreetMap (Leaflet).
5.  **Groups & Co-Ops**: Full lifecycle for local homeschool cooperatives.
6.  **Learning Hub**: Resource library for sharing educational materials.
7.  **Video Meetups**: Fully integrated Whereby video hosting for parent planning.
8.  **Safety & Verification**: Multi-step verification powered by Didit KYC and safety reporting.
9.  **Admin Dashboard**: Advanced 14-tab command center with Promo Code management and Audit Logs.
10. **Fito Guide AI**: AI assistant integrated via OpenRouter (Gemini 2.0 Flash).
11. **Promo System**: Robust discount engine with per-user limits and expiration tracking.

## Environment Variables
The platform requires several environment variables for production (configured in `apphosting.yaml` and Cloud Secret Manager):
- Firebase Config (API Key, Project ID, etc.)
- Stripe Keys (Secret, Webhook, Price IDs)
- Didit KYC (API Key, Workflow ID)
- Whereby Video (API Key)
- OpenRouter (API Key)

## Deployment
The project is configured for **Firebase App Hosting**. 
- Rules: `firebase deploy --only firestore:rules,storage:rules`
- Hosting: Automatic via GitHub connection to Firebase App Hosting.

## Platform Security
- **RBAC**: Multi-tier access (Owner, Admin, Parent, Leader).
- **Hardened Rules**: Strict Firestore rules preventing unauthorized field modifications.
- **Audit Logging**: All administrative actions are logged for security and accountability.


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

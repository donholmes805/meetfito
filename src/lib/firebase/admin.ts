import { initializeApp, getApps, cert, ServiceAccount, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Handle newlines in the private key
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
} as ServiceAccount;

const adminApp = 
  getApps().length === 0 
    ? initializeApp({
        credential: (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) 
          ? cert(serviceAccount) 
          : applicationDefault(),
      })
    : getApps()[0];

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);

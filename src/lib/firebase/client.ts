import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all environment variables are present
const isFirebaseConfigValid = 
  firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId && 
  firebaseConfig.storageBucket && 
  firebaseConfig.messagingSenderId && 
  firebaseConfig.appId;

let app: FirebaseApp;

if (getApps().length > 0) {
  app = getApp();
} else {
  if (isFirebaseConfigValid) {
    app = initializeApp(firebaseConfig);
  } else {
    console.warn("Firebase environment variables are missing. Firebase features will not work correctly.");
    // Create a dummy app to prevent crashes in other firebase services during initialization
    app = { name: "[DEFAULT]", options: {}, automaticDataCollectionEnabled: false } as FirebaseApp;
  }
}

export { app, isFirebaseConfigValid };

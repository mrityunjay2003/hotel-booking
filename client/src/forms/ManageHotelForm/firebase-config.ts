import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA8iin-4lkBM0ilxFWkevJfs68WVlAcYRc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "booking-caab6.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "booking-caab6",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "booking-caab6.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "900605450625",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:900605450625:web:1ae1f9ab34423b485eb080",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HG2K4K8Q63",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
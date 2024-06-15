import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA8iin-4lkBM0ilxFWkevJfs68WVlAcYRc",
  authDomain: "booking-caab6.firebaseapp.com",
  projectId: "booking-caab6",
  storageBucket: "booking-caab6.appspot.com",
  messagingSenderId: "900605450625",
  appId: "1:900605450625:web:1ae1f9ab34423b485eb080",
  measurementId: "G-HG2K4K8Q63",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
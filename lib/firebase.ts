import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBGducZcsg7raSbBj3Y4Gud3hHuYnT_abY",
  authDomain: "aaj-kya-khayenge.firebaseapp.com",
  projectId: "aaj-kya-khayenge",
  storageBucket: "aaj-kya-khayenge.firebasestorage.app",
  messagingSenderId: "706369187613",
  appId: "1:706369187613:web:f6c163d3a90ea8d8ecfbf4",
  measurementId: "G-Z3SE7EJC1D"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  }
  return null;
};


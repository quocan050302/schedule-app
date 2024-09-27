// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "schedule-d74d9.firebaseapp.com",
  projectId: "schedule-d74d9",
  storageBucket: "schedule-d74d9.appspot.com",
  messagingSenderId: "229878612311",
  appId: "1:229878612311:web:bb177112a54811b784fe12",
  measurementId: "G-VPB4L78EWW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

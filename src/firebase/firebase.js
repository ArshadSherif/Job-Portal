// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByUMIyo54nyupVE9TRnJZycxLP1w8mq4c",
  authDomain: "jobportal-e7dbd.firebaseapp.com",
  projectId: "jobportal-e7dbd",
  storageBucket: "jobportal-e7dbd.firebasestorage.app",
  messagingSenderId: "1022191345646",
  appId: "1:1022191345646:web:4f0ae4bd7def601980f8ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db= getFirestore(app);

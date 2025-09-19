// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";       
import { getFirestore } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6pO0yIyjwAemIyjE8rdVfgt2bzNVFbQI",
  authDomain: "wellness-tracker-a1aaa.firebaseapp.com",
  projectId: "wellness-tracker-a1aaa",
  storageBucket: "wellness-tracker-a1aaa.firebasestorage.app",
  messagingSenderId: "1021012747697",
  appId: "1:1021012747697:web:ebf86e7d7ee3153597c990"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  
export const db = getFirestore(app); 

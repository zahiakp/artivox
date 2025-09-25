// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuKfEtSbk54iZTxHPnt1jA4aMu_PYHkG8",
  authDomain: "rendezvous24-a33d2.firebaseapp.com",
  projectId: "rendezvous24-a33d2",
  storageBucket: "rendezvous24-a33d2.appspot.com",
  messagingSenderId: "753265229613",
  appId: "1:753265229613:web:e8bbf2da092bc0c1e55da4",
  measurementId: "G-X5WKMZ6NXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
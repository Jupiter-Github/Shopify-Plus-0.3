// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtEogiBnRLAsTgM3lCv4fBU5OMjENJyJE",
  authDomain: "test-project-842c9.firebaseapp.com",
  projectId: "test-project-842c9",
  storageBucket: "test-project-842c9.appspot.com",
  messagingSenderId: "277241443311",
  appId: "1:277241443311:web:7186748ea5fab1461b3c1a",
  measurementId: "G-21FJX2LREV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };
export default app;

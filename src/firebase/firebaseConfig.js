// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBmqY0kdm2e_W5GoTIV8Ehh7aGpbPv5c8g",
  authDomain: "todolist-app-3cf2c.firebaseapp.com",
  projectId: "todolist-app-3cf2c",
  storageBucket: "todolist-app-3cf2c.appspot.com",
  messagingSenderId: "799639027524",
  appId: "1:799639027524:web:0b034610a2a2d70dc06111",
  measurementId: "G-65J3SD719N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//console.log('Firebase initialized:', app);
const auth = getAuth(app);
//console.log('Auth instance:', auth);
const db = getFirestore(app);
//console.log('Firestore instance:', db);

const colref = collection(db, 'users');

export { app, auth, db, colref };
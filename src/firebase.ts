// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlDSqaXN2r6CYCDh1lZRl7c71ueNf-CNo",
  authDomain: "todo-app-f150e.firebaseapp.com",
  projectId: "todo-app-f150e",
  storageBucket: "todo-app-f150e.firebasestorage.app",
  messagingSenderId: "164229124791",
  appId: "1:164229124791:web:99645bf9a9eecbcfb73332",
  measurementId: "G-8FK89FMJBM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjFutnT4rNQqPskRQs0mcqgcHiQTdFo2c",
  authDomain: "codecrafters-48ec6.firebaseapp.com",
  projectId: "codecrafters-48ec6",
  storageBucket: "codecrafters-48ec6.firebasestorage.app",
  messagingSenderId: "608488426626",
  appId: "1:608488426626:web:b21ab406584a859266f89b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
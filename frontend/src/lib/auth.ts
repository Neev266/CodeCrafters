import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

// Email signup
export const signup = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

// Email login
export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

// Logout
export const logout = () => signOut(auth);

// Google login
const provider = new GoogleAuthProvider();
export const loginWithGoogle = () =>
  signInWithPopup(auth, provider);
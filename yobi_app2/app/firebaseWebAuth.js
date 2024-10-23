// app/firebaseWebAuth.js
import { auth } from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Function to sign in with Google
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to sign out from Google authentication
export const logoutGoogle = async () => {
  try {
    await signOut(auth);
    return 'User signed out';
  } catch (error) {
    throw new Error(error.message);
  }
};

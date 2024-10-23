// app/firebaseAuth.js
import { auth } from './firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut 
} from 'firebase/auth';

// Function to register a new user
export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to log in an existing user
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return 'Password reset email sent';
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to sign out
export const logout = async () => {
  try {
    await signOut(auth);
    return 'User signed out';
  } catch (error) {
    throw new Error(error.message);
  }
};

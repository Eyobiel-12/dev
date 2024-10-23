import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";  // Import Realtime Database SDK
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for persistence

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAL676Bob9vvuJ3UthEoY38X79ldn7rTo",
  authDomain: "fitnessapp-607b7.firebaseapp.com",
  projectId: "fitnessapp-607b7",
  storageBucket: "fitnessapp-607b7.appspot.com",
  messagingSenderId: "296249708855",
  appId: "1:296249708855:web:8e276c353e7caaad914ab2",
  measurementId: "G-BKEJ8GGQRF",
  databaseURL: "https://fitnessapp-607b7-default-rtdb.europe-west1.firebasedatabase.app",  // Add the Realtime Database URL
};


// Initialize Firebase only if not already initialized
let app;
let db;
let auth;
let realtimedb;  // Realtime Database

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);

  // Initialize Auth with AsyncStorage persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });

  db = getFirestore(app);
  realtimedb = getDatabase(app);  // Initialize Realtime Database
} else {
  app = getApp(); // Use the already initialized Firebase app
  auth = getAuth();
  db = getFirestore();
  realtimedb = getDatabase(app);  // Get Realtime Database if app is already initialized
}

export { db, auth, realtimedb };
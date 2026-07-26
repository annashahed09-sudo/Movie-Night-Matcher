import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your verified live Firebase project configuration keys
const firebaseConfig = {
  apiKey: "AIzaSyBtJCeBwpanGNILduGPYdkq19NuXZqIOPQ",
  authDomain: "movie-night-1c77a.firebaseapp.com",
  projectId: "movie-night-1c77a",
  storageBucket: "movie-night-1c77a.firebasestorage.app",
  messagingSenderId: "810341026886",
  appId: "1:810341026886:web:62d3f9916ad349af748e47"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

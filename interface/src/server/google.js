// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyB-KQWrnJZ0bnqhTCMdgunZZUsqtoXBdRU",
  authDomain: "elnora-cdf7a.firebaseapp.com",
  projectId: "elnora-cdf7a",
  storageBucket: "elnora-cdf7a.firebasestorage.app",
  messagingSenderId: "585053177631",
  appId: "1:585053177631:web:233916bf531cd3a2de522a",
  measurementId: "G-PE7LHYMTRP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();
export function signInWithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access Google APIs
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
  
        // The signed-in user info
        const user = result.user;
        console.log("User info:", user);
      })
      .catch((error) => {
        console.error("Google Sign-In Error:", error);
      });
  }


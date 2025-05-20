import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyB-KQWrnJZ0bnqhTCMdgunZZUsqtoXBdRU",
    authDomain: "elnora-cdf7a.firebaseapp.com",
    projectId: "elnora-cdf7a",
    storageBucket: "elnora-cdf7a.firebasestorage.app",
    messagingSenderId: "585053177631",
    appId: "1:585053177631:web:233916bf531cd3a2de522a",
    measurementId: "G-PE7LHYMTRP"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  
  export { db };
  
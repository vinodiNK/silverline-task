import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCUsxNh_ioSd8EpX1SEaYWpj1UFsR-xbrg",
    authDomain: "silverline-store-115ee.firebaseapp.com",
    projectId: "silverline-store-115ee",
    storageBucket: "silverline-store-115ee.firebasestorage.app",
    messagingSenderId: "131478410639",
    appId: "1:131478410639:web:01f978d4b8b3685ee3a7fa",
    measurementId: "G-ZYPE2TS588"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { addDoc, auth, collection, db, signInWithEmailAndPassword, signOut };
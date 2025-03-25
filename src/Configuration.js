import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from  'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvNwVnDdiCZYA1JkAMO-XqX2jHrTILGRY",
  authDomain: "didb-b3d6f.firebaseapp.com",
  projectId: "didb-b3d6f",
  storageBucket: "didb-b3d6f.firebasestorage.app",
  messagingSenderId: "363122690396",
  appId: "1:363122690396:web:1be0d00308892b0c60d999",
  measurementId: "G-K8R6PK86VX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const db=getFirestore(app)
export default app;
//const analytics = getAnalytics(app);
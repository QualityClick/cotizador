// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrFYl8k9R56K0haML0UwN-ZjvzV4NVolU",
  authDomain: "solupatch-54c3e.firebaseapp.com",
  projectId: "solupatch-54c3e",
  storageBucket: "solupatch-54c3e.appspot.com",
  messagingSenderId: "774006551319",
  appId: "1:774006551319:web:3d448483c40b3a12243d52",
  measurementId: "G-MP0ML27E94",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// const analytics = getAnalytics(app);

// NOTE: To keep deploying into hosting
//  npm run build
//  git add. git commit git push
//  firebase deploy

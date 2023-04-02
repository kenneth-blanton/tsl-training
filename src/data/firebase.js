import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEYYe8dUQE0iU_3dR3A9AaM7rcRuYzLRE",
  authDomain: "pactiv-tsl-tooltip.firebaseapp.com",
  projectId: "pactiv-tsl-tooltip",
  storageBucket: "pactiv-tsl-tooltip.appspot.com",
  messagingSenderId: "121453981725",
  appId: "1:121453981725:web:6c5a3be39051e3f7ecd6f4",
  measurementId: "G-L92JB2BMYE",
};

if (!firebaseConfig.apiKey)
  throw new Error("Missing firebase credential: apiKey");
if (!firebaseConfig.authDomain)
  throw new Error("Missing firebase credential: authDomain");
if (!firebaseConfig.projectId)
  throw new Error("Missing firebase credential: projectId");
if (!firebaseConfig.storageBucket)
  throw new Error("Missing firebase credential: storageBucket");
if (!firebaseConfig.messagingSenderId)
  throw new Error("Missing firebase credential: messagingSenderId");
if (!firebaseConfig.appId)
  throw new Error("Missing firebase credential: appId");
if (!firebaseConfig.measurementId)
  throw new Error("Missing firebase credential: measurementId");

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export { db, firebase };

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

// ✅ Firebase configuration (DO NOT expose API keys in public repositories)
const firebaseConfig = {
    apiKey: "AIzaSyCJ5hWb6lqDeJ-UcFjdheJIZD08e5YDY94",
    authDomain: "atompoint-test.firebaseapp.com",
    projectId: "atompoint-test",
    storageBucket: "atompoint-test.appspot.com",
    messagingSenderId: "431155322825",
    appId: "1:431155322825:web:9a1538021d2234c352d218",
    measurementId: "G-6V0DF5C0M0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, db, analytics };

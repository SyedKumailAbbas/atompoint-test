import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut
} from "firebase/auth";
import {
    doc, getDoc, setDoc, collection, query, where, getDocs, getFirestore
} from "firebase/firestore";
import { auth, db } from "./firebase-config"; // ✅ Ensure proper import

export const createNewUser = async (email, password, username) => {
    try {
        console.log("Checking if username exists...");

        const usernamesRef = collection(db, "users");
        const q = query(usernamesRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            throw new Error("Username already exists. Please choose another one.");
        }

        console.log("Username is unique. Creating user...");

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: username });

        console.log("Saving user details to Firestore...");

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email,
            username,
            createdAt: new Date(),
            updatedAt: new Date(),
            Blogs: [] 
        });

      
        
        return user;
    } catch (error) {
        console.error("Error creating user:", error.message);
        throw error;
    }
};

export const logIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in successfully:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("Login failed:", error.message);
        throw error;
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
        console.log("User logged out successfully");
    } catch (error) {
        console.error("Logout failed:", error.message);
        throw error;
    }
};

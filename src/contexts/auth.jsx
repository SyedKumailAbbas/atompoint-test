import React, { useEffect, createContext, useState, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export const authContext = createContext();

export const useAuth = () => {
  return useContext(authContext);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(""); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setUserLoggedIn(true);
        console.log("User logged in:", user.uid);
        fetchUsername(user.uid, true);
      } else {
        console.log("User logged out");
        setCurrentUser(null);
        setUserLoggedIn(false);
        setUsername("");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUsername = async (uid, isNewUser = false) => {
    let retries = isNewUser ? 3 : 1; 
    let delay = 1000;

    for (let i = 0; i < retries; i++) {
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const fetchedUsername = userDoc.data().username;
          console.log("Fetched Username:", fetchedUsername);
          setUsername(fetchedUsername);
          return; 
        } else {
          console.log("No username found for user:", uid);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
      await new Promise((res) => setTimeout(res, delay)); 
    }

    setUsername("Unknown");
  };

  const value = {
    currentUser,
    userLoggedIn,
    username, 
    loading,
  };

  return (
    <authContext.Provider value={value}>
      {!loading && children}
    </authContext.Provider>
  );
};

export default AuthProvider;

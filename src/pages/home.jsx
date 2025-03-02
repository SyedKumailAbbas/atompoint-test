import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth"; 
import Blog from "../components/blog"; 

const Home = () => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [refreshBlogs, setRefreshBlogs] = useState(false);

  useEffect(() => {
    if (!userLoggedIn) {
      navigate("/"); 
    }
  }, [userLoggedIn, navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Blog!</h1>
      <Blog key={refreshBlogs} /> 
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth"; 
import Blog from "../components/blog"; 

const Home = () => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [refreshBlogs, setRefreshBlogs] = useState(false);

  return (
    <div className=" p-6">
      <Blog key={refreshBlogs} /> 
    </div>
  );
};

export default Home;

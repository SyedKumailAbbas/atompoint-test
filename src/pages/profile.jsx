import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth";
import BlogForm from "../components/blogForm";
import MyBlogs from "../components/myBlog";
import { Modal, Button } from "antd"; 

const Profile = () => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [refreshBlogs, setRefreshBlogs] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    if (!userLoggedIn) {
      navigate("/"); 
    }
  }, [userLoggedIn, navigate]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mt-5"> {/* Ensure enough margin below the header */}
      <h1 className="text-center fw-bold mb-4">My Profile</h1>
      
      <div className="text-center mb-4">
        <Button type="primary" onClick={showModal}>
          Create Blog
        </Button>
      </div>

      <Modal title="Create a New Blog" open={isModalOpen} onCancel={handleClose} footer={null}>
        <BlogForm 
          onBlogCreated={() => {
            setRefreshBlogs(!refreshBlogs);
            handleClose(); 
          }} 
        />
      </Modal>

      <MyBlogs key={refreshBlogs} />
    </div>
  );
};

export default Profile;

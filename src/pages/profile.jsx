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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Blogs!</h1>
      
      <Button type="primary" onClick={showModal} className="mb-4">
        Create Blog
      </Button>
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

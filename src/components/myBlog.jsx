import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase-config";
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot, deleteDoc, updateDoc, doc, arrayRemove,
} from "firebase/firestore";
import { Modal, Button, Card, message } from "antd";
import { useAuth } from "../contexts/auth";
import ZeroScreen from "./zeroScreen";
import "bootstrap/dist/css/bootstrap.min.css";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, "blogs");
        const q = query(
          blogsRef,
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (snapshot.empty) {
            setBlogs([]);
            return;
          }
          setBlogs(
            snapshot.docs.map((docSnapshot) => ({
              id: docSnapshot.id,
              ...docSnapshot.data(),
            }))
          );
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [currentUser]);

  const openModal = (blog, isEdit = false) => {
    setSelectedBlog(blog);
    setEditTitle(blog.title);
    setEditContent(blog.content);
    setIsEditing(isEdit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (!selectedBlog) return;
    try {
      const blogRef = doc(db, "blogs", selectedBlog.id);
      const updatedBlog = {
        ...selectedBlog,
        title: editTitle,
        content: editContent,
        updatedAt: new Date(),
      };

      await updateDoc(blogRef, updatedBlog);

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === selectedBlog.id ? { ...blog, ...updatedBlog } : blog
        )
      );

      message.success("Blog updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating blog:", error);
      message.error("Failed to update blog.");
    }
  };


  const handleDelete = async (blogId) => {
    try {
      if (!currentUser) throw new Error("User not logged in");
      await deleteDoc(doc(db, "blogs", blogId));
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        Blogs: arrayRemove(blogId),
      });
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
      message.success("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      message.error("Failed to delete blog.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-dark fw-bold mb-4">📚 My Blogs</h1>
      {blogs.length === 0 ? (
        <ZeroScreen message="No blogs available." />
      ) : (
        <div className="row">
          {blogs.map((blog, index) => {
            const isLastOdd = blogs.length % 2 !== 0 && index === blogs.length - 1;
            return (
              <div
                key={blog.id}
                className={`d-flex justify-content-center mb-4 ${isLastOdd ? "col-12" : "col-md-6"
                  }`}
              >
                <Card
                  hoverable
                  className="shadow-lg rounded-lg border border-light p-4 bg-white w-100"
                  style={{ maxWidth: isLastOdd ? "100%" : "600px", transition: "transform 0.3s ease-in-out" }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  onClick={() => openModal(blog)}
                >
                  <h2 className="text-dark text-center fw-bold mb-3">{blog.title}</h2>
                  <p className="text-secondary text-center">
                    {blog.content.length > 120 ? `${blog.content.slice(0, 200)}...` : blog.content}
                  </p>
                  <div className="border-top pt-3 text-muted text-center">
                    <p>Posted on {blog.createdAt ? new Date(blog.createdAt.seconds * 1000).toLocaleString() : "Unknown Date"}</p>
                  </div>
                  <div className="text-center d-flex justify-content-center gap-2 mt-3">
                    <Button type="primary" onClick={(e) => { e.stopPropagation(); openModal(blog, true); }}>Edit</Button>
                    <Button type="primary" danger onClick={(e) => { e.stopPropagation(); handleDelete(blog.id); }}>Delete</Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        title={<h2 className="text-center fw-bold text-dark">{isEditing ? "Edit Blog" : selectedBlog?.title}</h2>}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
        className="custom-modal"
        zIndex={100}
        bodyStyle={{ maxHeight: "80vh", overflow: "hidden", overflowY: "auto" }}
      >
        {isEditing ? (
          <>
            <input className="form-control mb-2" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Edit Title" />
            <textarea className="form-control" rows={4} value={editContent} onChange={(e) => setEditContent(e.target.value)} placeholder="Edit Content" />
            <div className="text-center mt-3">
              <Button type="primary" onClick={handleUpdate}>Save Changes</Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-secondary fs-5">{selectedBlog?.content}</p>
            <div className="text-muted text-center mt-4">
              <p>Posted on {selectedBlog?.createdAt ? new Date(selectedBlog.createdAt.seconds * 1000).toLocaleString() : "Unknown Date"}</p>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MyBlogs;

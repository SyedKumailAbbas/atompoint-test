"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase-config";
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  arrayRemove,
} from "firebase/firestore";
import { Button, Card, Modal, Input, message } from "antd";
import { useAuth } from "../contexts/auth";
import ZeroScreen from "./zeroScreen";

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
      await updateDoc(blogRef, {
        title: editTitle,
        content: editContent,
        updatedAt: new Date(),
      });

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === selectedBlog.id
            ? { ...blog, title: editTitle, content: editContent }
            : blog
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
    <div className="mt-6 px-6 flex flex-col items-center">
      {blogs.length === 0 ? (
        <ZeroScreen message="No blogs available." />
      ) : (
        <div className="flex flex-wrap justify-center -mx-4">
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              title={blog.title}
              style={{ marginBottom: "20px", width: "100%", marginTop: "20px" }}
              className="shadow-md rounded-lg border border-gray-300 bg-white transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <p>{blog.content.slice(0, 100)}...</p>
              <Button type="link" onClick={() => openModal(blog)}>
                Read More
              </Button>
              <div className="flex justify-between mt-3">
                <Button size="small" onClick={() => openModal(blog, true)}>
                  Edit
                </Button>
                <Button size="small" danger onClick={() => handleDelete(blog.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={isEditing ? "Edit Blog" : selectedBlog?.title}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        {isEditing ? (
          <>
            <Input
              className="mb-2"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Edit Title"
            />
            <Input.TextArea
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Edit Content"
            />
            <Button type="primary" className="mt-2" onClick={handleUpdate}>
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <p className="text-gray-700">{selectedBlog?.content}</p>
            <p className="text-sm text-gray-500 mt-4">
              Posted on{" "}
              {selectedBlog?.createdAt
                ? new Date(
                    selectedBlog.createdAt.seconds * 1000
                  ).toLocaleString()
                : "Unknown Date"}
            </p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MyBlogs;

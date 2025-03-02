import React, { useState } from "react";
import { db, auth } from "../firebase/firebase-config";
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { Input, Button, Card } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { TextArea } = Input;

const BlogForm = ({ onBlogCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.warning("Title and content are required!", { position: "top-right" });
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      // Add blog to Firestore
      const docRef = await addDoc(collection(db, "blogs"), {
        userId: user.uid,
        title,
        content,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        Blogs: arrayUnion(docRef.id),
        updatedAt: new Date(),
      });

      setTitle("");
      setContent("");
      toast.success("Blog posted successfully!", { position: "top-right" });
      onBlogCreated(); 
    } catch (error) {
      toast.error(`Error: ${error.message}`, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Create a Blog" className="shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <Input
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="large"
        />
        <TextArea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />
        <Button type="primary" htmlType="submit" loading={loading} block>
          Post Blog
        </Button>
      </form>

      {/* Toast Notification Container */}
      <ToastContainer />
    </Card>
  );
};

export default BlogForm;

import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase-config";
import { collection, query, orderBy, onSnapshot, getDoc, doc } from "firebase/firestore";
import { Modal, Button, Card } from "antd";
import ZeroScreen from "./zeroScreen";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, "blogs");
        const q = query(blogsRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
          if (snapshot.empty) {
            setBlogs([]);
            return;
          }

          const blogsData = await Promise.all(
            snapshot.docs.map(async (docSnapshot) => {
              const blogData = docSnapshot.data();
              let username = "Unknown Author";

              if (blogData.userId) {
                try {
                  const userDocRef = doc(db, "users", blogData.userId);
                  const userDoc = await getDoc(userDocRef);
                  if (userDoc.exists()) {
                    username = userDoc.data().username || "Unknown Author";
                  }
                } catch (error) {
                  console.error("Error fetching username:", error);
                }
              }

              return { id: docSnapshot.id, ...blogData, username };
            })
          );

          setBlogs(blogsData);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const openModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mt-6 px-6 flex flex-col items-center">
      {blogs.length === 0 ? (
        <ZeroScreen message="No blogs available." />
      ) : (
        <div className="flex flex-wrap justify-center -mx-4">
          {blogs.map((blog) => (
            <div key={blog.id} style={{ width: "1000px", padding: "10px", marginLeft:"200px"}} className="flex justify-center">
              <Card
                hoverable
                style={{ height: "320px", padding: "20px", width: "80%" }}
                className="shadow-md rounded-lg border border-gray-300 bg-white transition-transform transform hover:scale-105 hover:shadow-xl"
                onClick={() => openModal(blog)}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">{blog.title}</h2>
                <p className="text-gray-700 text-center">
                  {blog.content.length > 120
                    ? `${blog.content.slice(0, 200)}...`
                    : blog.content}
                </p>

                <div className="mt-4 border-t border-gray-200 pt-3 text-sm text-gray-600 text-center">
                  <p>
                    <strong>By {blog.username}</strong> • Posted on{" "}
                    {blog.createdAt
                      ? new Date(blog.createdAt.seconds * 1000).toLocaleString()
                      : "Unknown Date"}
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button
                    type="link"
                    className="mt-3 text-indigo-600 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(blog);
                    }}
                  >
                    Read More
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      <Modal title={selectedBlog?.title} open={isModalOpen} onCancel={closeModal} footer={null}>
        <p className="text-gray-700">{selectedBlog?.content}</p>
        <p className="text-sm text-gray-500 mt-4">
          <strong>By {selectedBlog?.username}</strong> • Posted on{" "}
          {selectedBlog?.createdAt
            ? new Date(selectedBlog.createdAt.seconds * 1000).toLocaleString()
            : "Unknown Date"}
        </p>
      </Modal>
    </div>
  );
};

export default Blog;

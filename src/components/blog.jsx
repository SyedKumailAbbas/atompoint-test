import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase-config";
import { collection, query, orderBy, onSnapshot, getDoc, doc } from "firebase/firestore";
import { Modal, Button, Card } from "antd";
import ZeroScreen from "./zeroScreen";
import "bootstrap/dist/css/bootstrap.min.css";


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
    <div className="container mt-5">
      <h1 className="text-center text-dark fw-bold mb-4">📝 Latest Blogs</h1>

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
                  style={{
                    maxWidth: isLastOdd ? "100%" : "600px",
                    transition: "transform 0.3s ease-in-out",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  onClick={() => openModal(blog)}
                >
                  <h2 className="text-dark text-center fw-bold mb-3">{blog.title}</h2>
                  <p className="text-secondary text-center">
                    {blog.content.length > 120 ? `${blog.content.slice(0, 200)}...` : blog.content}
                  </p>

                  <div className="border-top pt-3 text-muted text-center">
                    <p>
                      <strong>By {blog.username}</strong> • Posted on{" "}
                      {blog.createdAt
                        ? new Date(blog.createdAt.seconds * 1000).toLocaleString()
                        : "Unknown Date"}
                    </p>
                  </div>

                  <div className="text-center">
                    <Button
                      type="primary"
                      className="mt-3"
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
            );
          })}
        </div>
      )}

      <Modal
        title={<h2 className="text-center fw-bold text-dark">{selectedBlog?.title}</h2>}
        open={isModalOpen}
        onCancel={closeModal}
        footer={[
          <Button key="close" type="primary" className="btn btn-danger" onClick={closeModal}>
            Close
          </Button>,
        ]}
        centered
        className="custom-modal"
        zIndex={1050}  // Increase zIndex
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <p className="text-secondary fs-5">{selectedBlog?.content}</p>
        <div className="text-muted text-center mt-4">
          <p>
            <strong>By {selectedBlog?.username}</strong> • Posted on{" "}
            {selectedBlog?.createdAt
              ? new Date(selectedBlog.createdAt.seconds * 1000).toLocaleString()
              : "Unknown Date"}
          </p>
        </div>
      </Modal>

    </div>
  );
};

export default Blog;

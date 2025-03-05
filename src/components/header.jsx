import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth";
import { logOut } from "../firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 

const Header = () => {
    const { userLoggedIn, username } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const navbarRef = useRef(null);

    const handleLogout = async () => {
        try {
            await logOut();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const closeNavbar = () => {
        if (navbarRef.current) {
            navbarRef.current.classList.remove("show"); 
        }
    };

    return (
        <nav 
            className="navbar navbar-expand-lg shadow fixed-top" 
            style={{
                background: "linear-gradient(90deg, #4A90E2, #1E3C72)", 
                padding: "12px"
            }}
        >
            <div className="container">
                <Link 
                    className="navbar-brand fw-bold text-white fs-4" 
                    to="/home"
                    style={{ letterSpacing: "1px" }}
                >
                    📘 Recruitment Blog
                </Link>
                
                <button 
                    className="navbar-toggler border-0" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav" ref={navbarRef}>
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${location.pathname === "/home" ? "active fw-bold text-warning" : "text-white"}`} 
                                to="/home"
                                onClick={closeNavbar} 
                                style={{ transition: "0.3s" }}
                            >
                                📖 All Blogs
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${location.pathname === "/my-blogs" ? "active fw-bold text-warning" : "text-white"}`} 
                                to="/my-blogs"
                                onClick={closeNavbar} 
                                style={{ transition: "0.3s" }}
                            >
                                ✍️ My Blogs
                            </Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav">
                        {userLoggedIn ? (
                            <li className="nav-item d-flex align-items-center">
                                <span className="me-3 fw-bold text-light">👋 Hello, {username || "User"}!</span>
                                <button 
                                    className="btn btn-danger px-3"
                                    onClick={() => { handleLogout(); closeNavbar(); }}
                                    style={{ transition: "0.3s" }}
                                >
                                    🚪 Logout
                                </button>
                            </li>
                        ) : location.pathname === "/" ? (
                            <li className="nav-item">
                                <Link className="btn btn-primary px-3" to="/register" onClick={closeNavbar}>📝 Register</Link>
                            </li>
                        ) : location.pathname === "/register" || location.pathname === "/home" ? (
                            <li className="nav-item">
                                <Link className="btn btn-success px-3" to="/" onClick={closeNavbar}>🔑 Sign In</Link>
                            </li>
                        ) : null}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;

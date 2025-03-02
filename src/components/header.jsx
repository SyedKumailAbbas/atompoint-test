import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth";
import { logOut } from "../firebase/auth";

const Header = () => {
    const { userLoggedIn, username } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logOut();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header style={styles.header}>
            <h1 style={styles.logo}>Recruitment Test Blog</h1>

            {/* Navigation Tabs */}
            <nav style={styles.nav}>
                <Link
                    to="/home"
                    style={{
                        ...styles.navLink,
                        ...(location.pathname === "/home" ? styles.navLinkActive : {}),
                    }}
                >
                    All Blogs
                </Link>
                <Link
                    to="/my-blogs"
                    style={{
                        ...styles.navLink,
                        ...(location.pathname === "/my-blogs" ? styles.navLinkActive : {}),
                    }}
                >
                    My Blogs
                </Link>
            </nav>

            {/* Auth Buttons */}
            <nav style={styles.nav}>
                {userLoggedIn ? (
                    <>
                        <span style={styles.username}>Hello, {username || "User"}!</span>
                        <button onClick={handleLogout} style={styles.button}>Logout</button>
                    </>
                ) : location.pathname === "/" ? (
                    <button style={styles.button}>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </button>
                ) : location.pathname === "/register" ? (
                    <button style={styles.button}>
                        <Link to="/" style={styles.link}>Sign In</Link>
                    </button>
                ) : null}
            </nav>
        </header>
    );
};

const styles = {
    header: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#f5f5f5",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
    },
    logo: {
        margin: 0,
        fontSize: "25px",
        color:"black"
    },
    nav: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
    },
    navLink: {
        textDecoration: "none",
        color: "red",
        fontSize: "16px",
        fontWeight: "bold",
        padding: "8px 12px",
        borderRadius: "4px",
        transition: "background 0.3s",
    },
    navLinkActive: {
        background: "#ddd",
    },
    button: {
        padding: "8px 20px",
        margin: "0 30px",
        cursor: "pointer",
        background: "red",
        color: "white",
        border: "none",
        borderRadius: "4px",
    },
    link: {
        textDecoration: "none",
        color: "white",
        fontSize: "16px",
    },
    username: {
        fontSize: "16px",
        fontWeight: "bold",
        color:"black"
    },
};

export default Header;

import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Input, Button } from "antd";
import { logIn } from "../firebase/auth.js";
import { useAuth } from "../contexts/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css"; 

const Login = () => {
    const navigate = useNavigate();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const { userLoggedIn } = useAuth();

    useEffect(() => {
        if (userLoggedIn) {
            navigate("/home", { replace: true });
        }
    }, [userLoggedIn, navigate]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value.trim();
        const password = e.target.password.value.trim();

        if (!email || !password) {
            toast.error("Please fill all fields!");
            return;
        }

        if (isSigningIn) return;

        setIsSigningIn(true);
        try {
            await logIn(email, password);
            toast.success("Login successful!");
            navigate("/home");
        } catch (error) {
            toast.error("Login failed. Please check your credentials.");
        } finally {
            setIsSigningIn(false);
        }
    };

    return (
        <div className="login-main">
            <div className="login-right">
                <div className="login-right-container">
                    <div className="login-center">
                        <h2 className="text-black">Welcome back!</h2>
                        <p className="text-black">Please enter your details</p>
                        <form onSubmit={handleLoginSubmit}>
                            <Input name="email" type="email" placeholder="Email" size="large" />
                            <div className="pass-input-div mt-2">
                                <Input.Password
                                    name="password"
                                    placeholder="Password"
                                    size="large"
                                    iconRender={(visible) => visible ? <FaEyeSlash /> : <FaEye />}
                                />
                            </div>
                            <div className="login-center-buttons mt-4">
                                <Button type="primary" htmlType="submit" loading={isSigningIn} block>
                                    {isSigningIn ? "Logging in..." : "Log In"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

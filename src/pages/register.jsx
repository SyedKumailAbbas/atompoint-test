import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Input, Button } from "antd";
import { useAuth } from "../contexts/auth";
import { useNavigate } from "react-router-dom";
import { createNewUser } from "../firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css"; 

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (userLoggedIn) {
            navigate("/home", { replace: true });
        }
    }, [userLoggedIn, navigate]);

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        let email = e.target.email.value.trim();
        let password = e.target.password.value.trim();
        let username = e.target.username.value.trim();

        if (!username) return toast.error("Username is required");
        if (!email) return toast.error("Email is required");
        if (!password) return toast.error("Password is required");
        if (password.length < 6) return toast.error("Password must be at least 6 characters");
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return toast.error("Username can only contain letters, numbers, and underscores");
        }

        if (isRegistering) return;

        setIsRegistering(true);
        try {
            await createNewUser(email, password, username);
            toast.success("Account created successfully!");
            navigate("/home");
        } catch (error) {
            console.error("Error creating user:", error);
            toast.error(error?.message || "An unexpected error occurred.");
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div className="login-main">
            <div className="login-right">
                <div className="login-right-container">
                    <div className="login-center">
                        <h2 className="text-black">Make your account for exciting blogs</h2>
                        <p className="text-black">Please enter your details</p>
                        <form onSubmit={handleRegisterSubmit}>
                            <Input name="username" placeholder="Username" size="large" />
                            <Input name="email" type="email" placeholder="Email" size="large" className="mt-2" />
                            <div className="pass-input-div mt-2">
                                <Input.Password
                                    name="password"
                                    placeholder="Password"
                                    size="large"
                                    iconRender={(visible) => visible ? <FaEyeSlash /> : <FaEye />}
                                />
                            </div>

                            {/* Added spacing before button */}
                            <div className="login-center-buttons mt-4">
                                <Button type="primary" htmlType="submit" loading={isRegistering} block>
                                    {isRegistering ? "Registering..." : "Register"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

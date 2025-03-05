import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/auth"; // Import AuthProvider
import Login from "./pages/login";
import Register from "./pages/register";
import { ToastContainer, toast } from 'react-toastify';
import Home from "./pages/home";
import Header from "./components/header"; // Import the Header component
import "./App.css";
import Profile from "./pages/profile"
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return (
    <AuthProvider> 
      <Router>
        <Header /> 
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/my-blogs" element={<Profile />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
      <ToastContainer position='top-center' />

    </AuthProvider>
  );
}

export default App;

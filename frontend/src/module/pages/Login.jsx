import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../services/firebase";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Google Sign‑In script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
      console.log("Initializing Google Sign-In with client ID:", clientId);
      
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        context: "signin",
        ux_mode: "popup",
        auto_prompt: false,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
        }
      );
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [navigate]);

  const handleCredentialResponse = async (response) => {
    try {
      console.log("Google Sign-In response received");
      
      // Create the credential from the response
      const credential = GoogleAuthProvider.credential(response.credential);
      
      // Sign in with Firebase using the Google credential
      const result = await signInWithCredential(auth, credential);
      const user = result.user;
      
      console.log("Google Sign-In successful:", user.email);
      
      // Store user info and redirect
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("username", user.displayName || "Google User");
      localStorage.setItem("userPhoto", user.photoURL || "");
      navigate("/user-dashboard"); 
    } catch (error) {
      console.error("Google Sign-In error:", error);
      
      // Show a more user-friendly error message
      let errorMessage = "Google login failed: " + error.message;
      
      // Check for the specific error we're trying to solve
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Authentication error: The Google Client ID is not authorized for this Firebase project. Please contact support.";
      }
      
      setError(errorMessage);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      return setError("Please enter both email and password!");
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/user-dashboard");
    } catch (error) {
      setError("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#3f83f8] via-[#5db1e9] to-[#4ed6cd] text-black flex justify-center items-center h-screen flex-col">
      <h1 className="mb-6 text-4xl font-bold Poppins text-center bg-gradient-to-r from-[#ffffff] via-[#e0e0e0] to-[#ffffff] text-transparent bg-clip-text p-4">
        Welcome Back to ContentCrafter
      </h1>

      <div className="bg-white p-8 rounded-lg w-96 text-center shadow-2xl">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Login</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 mb-4 text-black bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 pr-16 text-black bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 bg-white rounded-md border border-gray-300 hover:bg-gray-100"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M1 1l22 22" />
                  <path d="M17.94 17.94A10.24 10.24 0 0 1 12 19c-5 0-9-3.5-10-8a13.06 13.06 0 0 1 5.4-4.9" />
                  <path d="M9.53 9.53a3.5 3.5 0 0 0 4.94 4.94" />
                  <path d="M14.12 14.12A3.5 3.5 0 0 1 9.88 9.88" />
                  <path d="M14.67 14.67L19.8 19.8" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M1 12C2 7.5 6.5 4 12 4s10 3.5 11 8c-1 4.5-5.5 8-11 8s-10-3.5-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 font-semibold bg-gradient-to-r from-[#3f83f8] to-[#4ed6cd] rounded-md hover:from-[#4ed6cd] hover:to-[#3f83f8] text-white transition duration-200 ease-in-out"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500">or login with</p>

        <div id="googleSignInDiv" className="mt-4"></div>

        <p className="mt-6 text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

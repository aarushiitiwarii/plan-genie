import React, { useState } from "react";
import styles from "./AuthModal.module.css";
import { loginUser, signupUser } from "../api";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function AuthModal({ onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = isLogin
        ? await loginUser({ email, password })
        : await signupUser({ name, email, password });

      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("userName", res.data.name);
      onLoginSuccess();
      onClose();
    } catch (err) {
      alert("❌ Login/Signup failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { email, name, sub: googleId } = decoded;

      const res = await fetch("http://localhost:5000/api/users/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, googleId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google sign-in failed");

      localStorage.setItem("userId", data._id);
      localStorage.setItem("userName", data.name);
      onLoginSuccess();
      onClose();
    } catch (err) {
      alert("❌ Google login failed: " + err.message);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>
          {isLogin ? "Log In to PlanGenie" : "Sign Up for PlanGenie"}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>

        <div className={styles.divider}>or</div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => alert("❌ Google Sign-in Failed")}
        />

        <p className={styles.toggle}>
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <span className={styles.linkText} onClick={() => setIsLogin(false)}>
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span className={styles.linkText} onClick={() => setIsLogin(true)}>
                Log in
              </span>
            </>
          )}
        </p>

        <button className={styles.closeBtn} onClick={onClose}>×</button>
      </div>
    </div>
  );
}

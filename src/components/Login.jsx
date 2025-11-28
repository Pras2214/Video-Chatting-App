import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../Login.css"; // Import CSS file for styling

import { BACKEND_URL } from "../config";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      fetch(`${BACKEND_URL}/loginData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
    } catch (error) {
      console.error("Error sending login data:", error.message);
    }

    let userConfirmed = false;
    let confirmedUsername = "";

    try {
      const response = await fetch(`${BACKEND_URL}/sendConfirmation`);
      const data = await response.json();
      userConfirmed = data.userConfirmed;
      confirmedUsername = data.username;
    } catch (error) {
      console.error(error);
    }

    if (userConfirmed) {
      navigate("/lobby", { state: { username: confirmedUsername } });
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Login</button>
        <p>Do not have an account? <a style={{ cursor: "pointer" }} onClick={() => { navigate("/signup") }}>Sign Up</a></p>
      </form>
    </div>
  );
};

export default Login;

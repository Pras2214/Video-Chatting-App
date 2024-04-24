import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../Login.css"; // Import CSS file for styling

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can add your logic for authentication
    try {
      fetch("http://localhost:3000/loginData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Login data sent successfully");

      // Here you can add your logic for user registration
    } catch (error) {
      console.error("Error sending login data:", error.message);
    }

    let userConfirmed = false;
    try {
      const response = await fetch("http://localhost:3000/sendConfirmation");
      userConfirmed = await response.json();
    } catch (error) {
      console.error(error);
    }

    if (userConfirmed) {
      // Successful login, redirect to dashboard or home page
      // console.log("Login successful");
      navigate("/lobby");
      setError("");
    } else {
      // Failed login, display error message
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
        <p>Do not have an account? <a style={{cursor:"pointer"}}onClick={()=>{navigate("/signup")}}>Sign Up</a></p>
      </form>
    </div>
  );
};

export default Login;

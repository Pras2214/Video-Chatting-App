import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../Signup.css"; // Import CSS file for styling

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  //   const saveSignupData=async ()=>{
  //         try {
  //           const response = await fetch("http://localhost:3000/signupData", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify(formData),
  //           });
  //           if (!response.ok) {
  //             throw new Error("Failed to save signup data");
  //           }
  //           console.log("Signup data saved successfully");
  //         } catch (error) {
  //           console.error("Error saving signup data:", error.message);
  //         }
  //       };

  //   }

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = {
    username,
    email,
    password,
  };


  try {
    fetch("http://localhost:3000/signupData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log("Signup data saved successfully");

    // Here you can add your logic for user registration
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      // Successful registration, you can proceed with further actions like API call
      navigate("/Lobby");
      setError("");
      // Reset form fields
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  } catch (error) {
    console.error("Error saving signup data:", error.message);
  }
};

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Sign Up</button>
        <p>Already have an account? <a style={{cursor:"pointer"}} onClick={()=>{navigate("/login")}}>Log In</a></p>
      </form>
    </div>
  );
};

export default Signup;

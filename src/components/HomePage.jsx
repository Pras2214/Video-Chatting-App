import React, { useState } from "react";
import { useNavigate } from "react-router";

import "../HomePage.css";

export let joinedObj = {};

const HomePage = () => {
  const navigate = useNavigate()
  const Login = () => {
    navigate("/Login");
  };
  const Signup = () => {
    navigate("/signup");
  };
  const [joined, setJoined] = useState(false);
  const [userName, setUserName] = useState("");
  joinedObj = {
    joined,
    setJoined,
  };
  return (
    <div className="container">
      <h1 className="title">Video Call</h1>
      <div className="options">
        <div className="option">
          <button className="login-button" type="button" onClick={Login}>
            Log in
          </button>
          <p className="option-text">Already Have an Account?</p>
        </div>
        <div className="option">
          <button className="signup-button" type="button" onClick={Signup}>
            Sign up
          </button>
          <p className="option-text">New here?</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

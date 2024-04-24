import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Signup from "./components/Signup"
import Lobby from "./components/Lobby"
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={HomePage}/>
          <Route path="/login" Component={Login}/>
          <Route path="/signup" Component={Signup}/>
          <Route path="/lobby" Component={Lobby}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

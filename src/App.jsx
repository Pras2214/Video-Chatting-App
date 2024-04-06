import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Lobby from "./components/Lobby";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Lobby}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

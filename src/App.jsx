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
          {/* Add the functionality so that when the leave button is pressed the user is redirected to the lobby page */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

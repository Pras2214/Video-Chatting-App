import React, { useState, useContext } from "react";
import { UserProvider } from "./components/Context";
import VideoRoom from "./components/VideoRoom";
import Controls from "./components/Controls";
import "./App.css";

function App() {
  const [joined, setJoined] = useState(false);
  return (
    <>
      <UserProvider>
        <h1>Video Call</h1>
        {!joined && <button onClick={() => setJoined(true)}>Join Room</button>}
        {joined && <Controls />}
        {joined && <VideoRoom />}
      </UserProvider>
    </>
  );
}

export default App;

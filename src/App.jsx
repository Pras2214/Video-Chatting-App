import React, { useState } from "react";
import VideoRoom from "./components/VideoRoom";
import Controls from "./components/Controls";
import "./App.css";

function App() {
  const [joined, setJoined] = useState(false);
  return (
    <>
      <h1>Video Call</h1>
      {!joined && <button onClick={() => setJoined(true)}>Join Room</button>}
      {joined && <Controls />}
      {joined && <VideoRoom />}
    </>
  );
}

export default App;

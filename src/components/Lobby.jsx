import React, { useState, useContext } from "react";
import { UserProvider } from "./Context";
import VideoRoom from "./VideoRoom";
import Controls from "./Controls";

export let joinedObj = {};

const Lobby = () => {
  const [joined, setJoined] = useState(false);
  joinedObj = {
    joined,
    setJoined,
  };
  return (
    <>
      <h1>Video Call</h1>
      <UserProvider>
        {!joined && <button onClick={() => setJoined(true)}>Join Room</button>}
        {joined && <Controls />}
        {joined && <VideoRoom />}
      </UserProvider>
    </>
  );
};

export default Lobby;

import React, { useState, useContext } from "react";
import { UserProvider } from "./Context";
import VideoRoom from "./VideoRoom";
import Controls from "./Controls";
import { useLocation } from "react-router-dom";

export let joinedObj = {};

const Lobby = () => {
  const location = useLocation();
  const [joined, setJoined] = useState(false);
  const [userName, setUserName] = useState(location.state?.username || "Guest");
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
        {joined && <VideoRoom userName={userName} />}
      </UserProvider>
    </>
  );
};

export default Lobby;

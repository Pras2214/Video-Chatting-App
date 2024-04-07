import React, { useState, useContext } from "react";
import { UserProvider } from "./Context";
import VideoRoom from "./VideoRoom";
import Controls from "./Controls";

export let joinedObj = {};

const Lobby = () => {
  const [joined, setJoined] = useState(false);
  const [userName, setUserName] = useState("");
  const [channelName, setChannelName] = useState("");
  const handleSetUserName = (e) => {
    setUserName(e.target.value);
  };
  const handleSetChannelName = (e) => {
    setChannelName(e.target.value);
  };
  joinedObj = {
    joined,
    setJoined,
  };
  return (
    <>
      <h1>Video Call</h1>
      {joined && <h3>{channelName}</h3>}
      <UserProvider>
        {!joined && (
          <form>
            <label htmlFor="userName">User Name:</label>
            <input
              name="userName"
              type="text"
              placeholder="Enter the User Name"
              onChange={handleSetUserName}
            />
            <label htmlFor="channelName">Channel Name:</label>
            <input
              name="channelName"
              type="text"
              placeholder="Enter the Channel Name"
              onChange={handleSetChannelName}
            />
            {!joined && (
              <button onClick={() => setJoined(true)}>Join Room</button>
            )}
          </form>
        )}
        {joined && <Controls />}
        {joined && <VideoRoom userName={userName} />}
      </UserProvider>
    </>
  );
};

export default Lobby;

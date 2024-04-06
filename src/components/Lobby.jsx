import React, { useState, useContext } from "react";
import { UserProvider } from "./Context";
import VideoRoom from "./VideoRoom";
import Controls from "./Controls";

const Lobby = (props) => {
    // const {isJoined} = props;
  const [joined, setJoined] = useState(false);

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

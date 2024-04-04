import React, { useContext } from "react";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { userContext } from "./Context";

const Controls = () => {
  const user = useContext(userContext);
  const toggleVideo = () => {
    if (user.videoTrack?.isPlaying()) {
      console.log("Playing Video");
    }
  };
  const toggleAudio = (user) => {};
  const leave = () => {};
  return (
    <div>
      <button onClick={toggleVideo}>
        <VideocamIcon></VideocamIcon>
      </button>
      <button onClick={toggleAudio}>
        <MicIcon></MicIcon>
      </button>
      <button onClick={leave}>
        <ExitToAppIcon></ExitToAppIcon>Leave
      </button>
    </div>
  );
};

export default Controls;

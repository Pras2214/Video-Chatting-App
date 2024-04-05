import React, { useContext, useState } from "react";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import UserContext from "./Context";

const Controls = () => {
  const {user} = useContext(UserContext);
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const mute = async (mediaType) => {
    if (mediaType === "video") {
      await user.videoTrack.setEnabled(!trackState.video);
      setTrackState((prevState) => {
        return { ...prevState, video: !prevState.video };
      });
    }
    if (mediaType === "audio") {
      await user.audioTrack.setEnabled(!trackState.audio);
      setTrackState((prevState) => {
        return { ...prevState, audio: !prevState.audio };
      });
    }
  };
  const leave = () => {
    // await user.user.leave();
    // user.user.removeAllListeners();
    user.videoTrack.close();
    user.audioTrack.close();
  };
  return (
    <div>
      <button onClick={() => mute("video")}>
        <VideocamIcon></VideocamIcon>
      </button>
      <button onClick={() => mute("audio")}>
        <MicIcon></MicIcon>
      </button>
      <button onClick={leave}>
        <ExitToAppIcon></ExitToAppIcon>Leave
      </button>
    </div>
  );
};

export default Controls;

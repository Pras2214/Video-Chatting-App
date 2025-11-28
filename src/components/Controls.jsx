import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import UserContext from "./Context";
import { joinedObj } from "./Lobby";


const Controls = () => {
  const navigate = useNavigate()
  const { user, client, usersObj } = useContext(UserContext);
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
  const leave = async () => {
    await client.leave();
    client.removeAllListeners();
    user.audioTrack.close();
    user.videoTrack.close();
    usersObj.setUsers(
      usersObj.users.filter((u) => u.uid !== user.uid)
    );
    joinedObj.setJoined(false)
    navigate("/lobby")
  };
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "2rem", justifyContent: "center" }}>
      <button onClick={() => mute("video")}>
        {trackState.video ? <VideocamIcon /> : <VideocamOffIcon />}
      </button>
      <button onClick={() => mute("audio")}>
        {trackState.audio ? <MicIcon /> : <MicOffIcon />}
      </button>
      <button onClick={leave} style={{ background: "red" }}>
        <ExitToAppIcon></ExitToAppIcon>Leave
      </button>
    </div>
  );
};

export default Controls;

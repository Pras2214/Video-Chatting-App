import React, { useEffect, useState, useContext } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import VideoPlayer from "./VideoPlayer";
import { UserContext } from "./Context";
// import { RtcTokenBuilder } from "../Tools/DynamicKey/AgoraDynamicKey/nodejs/src/RtcTokenBuilder";
// import { Role } from "../Tools/DynamicKey/AgoraDynamicKey/nodejs/src/RtcTokenBuilder";

// const agora = require("agora-access-token");

// const RtcTokenBuilder =
//   require("../Tools/DynamicKey/AgoraDynamicKey/nodejs/src/RtcTokenBuilder").RtcTokenBuilder;
// const RtcRole = require("../src/RtcTokenBuilder").Role;

// Need to set environment variable AGORA_APP_ID
// const appId = "eda4b076ae714a89a420adbfae0167fa";
// Need to set environment variable AGORA_APP_CERTIFICATE
// const appCertificate = "e84437506bc148c588e815fc5eab8d62";

// const channelName = "7d72365eb983485397e3e3f9d460bdda";
// const uid = 2882341273;
// // const account = "2882341273";
// const role = agora.RtcRole.PUBLISHER;
// const expirationTimeInSeconds = 3600;
// const currentTimestamp = Math.floor(Date.now() / 1000);
// const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

// const APP_ID = "eda4b076ae714a89a420adbfae0167fa";
// const TOKEN =
// "007eJxTYFj+bY1vYeb1xKT7AryzF5+L1P7w7vDKOE4rBdfTgps7hUsUGFJTEk2SDMzNElPNDU0SLSwTTYwMElOS0hJTDQzNzNMSFyyVT2sIZGQoOH+MgREKQXwWhtzEzDwGBgCCNyBW";
// const CHANNEL = "main";

// const appID = 'YOUR_APP_ID';
// const APP_CERTIFICATE = 'e84437506bc148c588e815fc5eab8d62';
// const CHANNEL = 'main';
// const uid = 0; // Use 0 for the token owner's UID

// const expirationTimeInSeconds = 0; // Set to 0 for no expiration

// const TOKEN = RtcTokenBuilder.buildTokenWithUid(
//   appId,
//   appCertificate,
//   channelName,
//   uid,
//   role,
//   privilegeExpiredTs
// );

const VideoRoom = ({ userName }) => {
  const [users, setUsers] = useState([]);
  const [Client, setClient] = useState();
  const [localTracks, setLocalTracks] = useState([]);
  const [data, setData] = useState(null);
  const { updateUser } = useContext(UserContext);
  const usersObj = {
    users,
    setUsers,
  };

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/data");
      const dat = await response.json();
      setData(dat);
    } catch (error) {
      console.error(error);
    }
  };

  let TOKEN, APP_ID, CHANNEL, uid;

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((prevUsers) => [...prevUsers, user]);
    }
    if (mediaType === "audio") {
    }
  };
  const handleUserLeft = (user) => {
    setUsers((prevUsers) => prevUsers.filter((u) => u.uid != user.uid));
  };

  useEffect(() => {
    // console.log(TOKEN);
    
    if (data) {
      ({ TOKEN, APP_ID, CHANNEL, uid } = data);
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      client.on("user-published", handleUserJoined);
      client.on("user-left", handleUserLeft);
      client
        .join(APP_ID, CHANNEL, TOKEN, uid)
        .then((uid) => {
          console.log(uid);
          return Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid]);
        })
        .then(([tracks, uid]) => {
          console.log(uid);
          const [audioTrack, videoTrack] = tracks;
          setLocalTracks(tracks);
          setUsers((prevUsers) => [
            ...prevUsers,
            { uid, videoTrack, audioTrack, name: userName },
          ]);
          client.publish(tracks);

          return () => {
            for (let localTrack of localTracks) {
              localTrack.stop();
              localTrack.close();
            }
            client.off("user-published", handleUserJoined);
            client.off("user-left", handleUserLeft);
            client.unpublish(tracks).then(() => client.leave());
          };
        });
        setClient(client)
    }
  }, [data]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,200px)",
          gap: "50px",
        }}
      >
        {users.map((user) => (
          <div key={user.uid}>
            <div>{user.name ? "You" : user.uid}</div>
            <VideoPlayer key={user.uid} users={users} user={user} />
            {updateUser(user, Client, usersObj)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoRoom;

import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import VideoPlayer from "./VideoPlayer";

const APP_ID = "eda4b076ae714a89a420adbfae0167fa";
const TOKEN =
  "007eJxTYGh68SR9IaPDj4kr1zls7rsz3VLLeHplaEX81NVPtRrs1jcrMKSmJJokGZibJaaaG5okWlgmmhgZJKYkpSWmGhiamaclbqnnTWsIZGTgV33OwAiFID4LQ25iZh4DAwCuuSA/";
const CHANNEL = "main";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const VideoRoom = () => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
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
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    client
      .join(APP_ID, CHANNEL, TOKEN, null)
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
          { uid, videoTrack, audioTrack },
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
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,200px)" }}>
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
};

export default VideoRoom;

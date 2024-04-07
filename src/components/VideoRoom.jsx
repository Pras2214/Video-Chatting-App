import React, { useEffect, useState, useContext } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import VideoPlayer from "./VideoPlayer";
import { UserContext } from "./Context";

const APP_ID = "eda4b076ae714a89a420adbfae0167fa";
const TOKEN =
  "007eJxTYMgpe+p0xfhE5qe37MtZiq4s3M+jEPglm7eyZfqld3/9U3sVGFJTEk2SDMzNElPNDU0SLSwTTYwMElOS0hJTDQzNzNMSX28USmsIZGRI/rqTiZEBAkF8FobcxMw8BgYA6s0iHA==";
const CHANNEL = "main";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const userMap = new Map();

const VideoRoom = ({ userName }) => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const { updateUser } = useContext(UserContext);
  const usersObj = {
    users,
    setUsers,
  };
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
          { uid, videoTrack, audioTrack, name: userName },
        ]);
        userMap[uid] = userName;
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,200px)",
          gap: "50px",
        }}
      >
        {users.map((user) => (
          <>
            <VideoPlayer key={user.uid} users={users} user={user} />
            {updateUser(user, client, usersObj)}
          </>
        ))}
        {/* {console.log(userMap)} */}
      </div>
    </div>
  );
};

export default VideoRoom;

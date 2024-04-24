import React, { useEffect, useState, useContext } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import VideoPlayer from "./VideoPlayer";
import { UserContext } from "./Context";

let TOKEN,APP_ID,CHANNEL; 

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const VideoRoom = ({ userName }) => {
  const [users, setUsers] = useState([]);
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

    if (data) {
      ({ TOKEN, APP_ID, CHANNEL} = data);
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
            {updateUser(user, client, usersObj)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoRoom;

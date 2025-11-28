import React, { useEffect, useState, useContext } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import VideoPlayer from "./VideoPlayer";
import { UserContext } from "./Context";

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

  useEffect(() => {
    let mounted = true;
    let localTracksRef = [];

    const initAgora = async () => {
      if (!data) return;

      const { TOKEN, APP_ID, CHANNEL } = data;

      client.on("user-published", handleUserJoined);
      client.on("user-left", handleUserLeft);

      try {
        // Explicitly ask for permissions first to trigger browser prompt
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        // Join with null to let Agora assign a UID
        const joinedUid = await client.join(APP_ID, CHANNEL, TOKEN, null);
        if (!mounted) return;

        // Save local UID to DB
        if (userName) {
          try {
            await fetch("http://localhost:3000/updateUid", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username: userName, uid: joinedUid.toString() }),
            });
          } catch (err) {
            console.error("Failed to sync UID:", err);
          }
        }

        const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        if (!mounted) {
          tracks.forEach(track => track.close());
          return;
        }

        const [audioTrack, videoTrack] = tracks;
        localTracksRef = tracks;
        setLocalTracks(tracks);

        setUsers((prevUsers) => [
          ...prevUsers,
          { uid: joinedUid, videoTrack, audioTrack, name: userName },
        ]);

        // Update context with local user details so Controls work
        updateUser({ uid: joinedUid, videoTrack, audioTrack, name: userName }, client, usersObj);

        await client.publish(tracks);
      } catch (error) {
        console.error("Agora Error:", error);
      }
    };

    initAgora();

    return () => {
      mounted = false;
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);

      // Stop and close local tracks
      localTracksRef.forEach(track => {
        track.stop();
        track.close();
      });

      // Unpublish and leave
      client.unpublish(localTracksRef).then(() => client.leave()).catch(e => console.error(e));
    };
  }, [data]);

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      let remoteName = "User " + user.uid;
      try {
        const res = await fetch(`http://localhost:3000/getUserByUid?uid=${user.uid}`);
        if (res.ok) {
          const uData = await res.json();
          if (uData.username) remoteName = uData.username;
        }
      } catch (e) {
        console.error("Failed to fetch remote username", e);
      }

      setUsers((prevUsers) => {
        const exists = prevUsers.find(u => u.uid === user.uid);
        if (exists) {
          return prevUsers.map(u =>
            u.uid === user.uid
              ? { ...u, videoTrack: user.videoTrack, audioTrack: user.audioTrack, name: remoteName }
              : u
          );
        }
        return [
          ...prevUsers,
          {
            uid: user.uid,
            videoTrack: user.videoTrack,
            audioTrack: user.audioTrack,
            name: remoteName,
          },
        ];
      });
    }
  };

  const handleUserLeft = (user) => {
    setUsers((prevUsers) => prevUsers.filter((u) => u.uid != user.uid));
  };

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
            <div>{user.name || user.uid}</div>
            <VideoPlayer key={user.uid} users={users} user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoRoom;

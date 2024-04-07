import React, { useEffect, useRef } from "react";

const VideoPlayer = ({ user,users}) => {
  const ref = useRef();

  useEffect(() => {
    user.videoTrack.play(ref.current);
  }, []);

  return (
    <div>
      {/* Uid: {user.uid} */}
      {/* Name: {name} */}
      {console.log(users)}
      <div ref={ref} style={{ width: "200px", height: "200px" }}></div>
    </div>
  );
};

export default VideoPlayer;

import React, { useEffect, useRef } from "react";

const VideoPlayer = ({ user, users }) => {
  const ref = useRef();

  useEffect(() => {
    if (user.videoTrack) {
      user.videoTrack.play(ref.current);
    }
  }, [user.videoTrack]);

  return (
    <div>
      <div
        ref={ref}
        style={{
          width: "200px",
          height: "200px",
        }}
      ></div>
    </div>
  );
};

export default VideoPlayer;

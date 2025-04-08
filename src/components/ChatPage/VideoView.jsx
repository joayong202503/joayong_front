import React from 'react';

const Video = ({ ref, videoType, onClick, isMuted, className }) => {
  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted={isMuted}
      className={className}
      onClick={onClick}
    />
  );
};

export default Video;

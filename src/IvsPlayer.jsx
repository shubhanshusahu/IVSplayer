import React, { useState, useRef } from "react";

import BasePlayer from "./BasePlayer";
import PlayerControls from "./PlayerControls";
import { CONTROLS, POSITION } from "./config";

import "./ivs-player.css";

const DEFAULT_POSITION = "auto";
const TRANSITION = "200ms ease-in-out";

const videoPlayer = React.createRef(null);
const IvsPlayer = () => {
  const { IVSPlayer } = window;
  const { isPlayerSupported } = IVSPlayer;
  const playerBaseEl = useRef(null);

  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [muted, setMuted] = useState(false);

  const [playerPosition, setPlayerPosition] = useState({
    top: DEFAULT_POSITION,
    right: DEFAULT_POSITION,
    bottom: DEFAULT_POSITION,
    left: DEFAULT_POSITION
  });
  const [playerSize, setPlayerSize] = useState({
    width: "500",
    height: "500"
  });

  const close = () => {
    videoPlayer.current.pause();
    setIsMiniPlayer(false);
  };

  const resize = () => {
    const { offsetLeft, offsetTop } = playerBaseEl.current;

    window.scrollTo({
      top: offsetTop - 20,
      left: offsetLeft,
      behavior: "smooth"
    });
  };

  const toggleMute = () => {
    const shouldMute = !videoPlayer.current.isMuted();
    videoPlayer.current.setMuted(shouldMute);
    setMuted(shouldMute);
  };

  const initPlayer = (reference) => {
    if (isPlayerSupported) {
      //const player = IVS.create();
      const player = IVSPlayer.create(reference);
      player.attachHTMLVideoElement(reference);
      //player.play();
      player.load(
        "https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8"
      );
      player.setMuted(true);
      player.play();
      videoPlayer.current = player;
    }
  };

  return (
    <div className="MiniPlayer" ref={playerBaseEl}>
      <div className="MiniPlayer-videoBox">
        <div
          className={`MinPlayer-video`}
          style={{
            top: playerPosition.top,
            right: playerPosition.right,
            bottom: playerPosition.bottom,
            left: playerPosition.left,
            width: `${playerSize.width}`,
            height: `${playerSize.height}`,
            transition: `height ${TRANSITION}, width ${TRANSITION}`
          }}
        >
          <BasePlayer initializePlayer={initPlayer} />

          <PlayerControls
            controls={[CONTROLS.mute, CONTROLS.close, CONTROLS.resize]}
            muted={muted}
            onClose={close}
            onResize={resize}
            onMute={toggleMute}
          />
        </div>
      </div>
    </div>
  );
};

export default IvsPlayer;

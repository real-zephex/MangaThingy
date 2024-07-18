import { MediaPlayer, MediaProvider } from "@vidstack/react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

const loadVideoPlayer = (url: string, title: string) => {
  return (
    <MediaPlayer
      title={title}
      src={url}
      aspectRatio="16/9"
      load="eager"
      playsInline
      volume={0.3}
      className="w-full"
    >
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
};

export default loadVideoPlayer;

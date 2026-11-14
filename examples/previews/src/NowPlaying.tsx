import { NowPlaying } from "@twentyfirstmedia/ui-core";
import "./_connectors";

export default function Preview() {
  return (
    <div style={{ maxWidth: 480 }}>
      <NowPlaying
        title="Weightless"
        artist="Marconi Union"
        album="Ambient Transmissions"
        position={203}
        duration={488}
        playing
        device="Living room speaker"
        onPlayPause={() => {}}
        onNext={() => {}}
        onPrevious={() => {}}
        service={{ name: "Spotify", icon: "brandSpotify" }}
      />
    </div>
  );
}

import { Audio } from "@remotion/media";
import { AbsoluteFill, Series, interpolate, staticFile, useVideoConfig } from "remotion";
import {
  BrideScene,
  ClosingScene,
  GroomScene,
  HostsScene,
  InvocationScene,
  MomentScene,
  TogetherScene,
  VenueScene,
} from "./scenes";
import { Ground } from "./parts";
import { FILM, FPS } from "./schedule";

export type InvitationProps = {
  /** True only when public/audio/wedding.mp3 exists. */
  hasAudio: boolean;
};

const frames = (seconds: number) => Math.round(seconds * FPS);

function Soundtrack() {
  const { durationInFrames, fps } = useVideoConfig();
  return (
    <Audio
      src={staticFile("audio/wedding.mp3")}
      volume={(frame) =>
        interpolate(frame, [durationInFrames - 3 * fps, durationInFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
}

/** The invitation as a sixty-second film: eleven scenes over one continuous ground. */
export function Invitation({ hasAudio }: InvitationProps) {
  return (
    <AbsoluteFill className="film font-serif font-medium text-ivory">
      <Ground />
      <Series>
        <Series.Sequence durationInFrames={frames(FILM.invocation.seconds)}>
          <InvocationScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={frames(FILM.hosts.seconds)}>
          <HostsScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={frames(FILM.groom.seconds)}>
          <GroomScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={frames(FILM.bride.seconds)}>
          <BrideScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={frames(FILM.together.seconds)}>
          <TogetherScene />
        </Series.Sequence>
        {FILM.moments.map((moment, index) => (
          <Series.Sequence key={index} durationInFrames={frames(moment.seconds)}>
            <MomentScene index={index} />
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={frames(FILM.venue.seconds)}>
          <VenueScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={frames(FILM.closing.seconds)}>
          <ClosingScene />
        </Series.Sequence>
      </Series>
      {hasAudio && <Soundtrack />}
    </AbsoluteFill>
  );
}

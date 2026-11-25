import { Audio } from "@remotion/media";
import { AbsoluteFill, Series, interpolate, staticFile, useVideoConfig } from "remotion";
import { ClosingScene, HostsScene, InvocationScene, MeetingScene, MomentScene, VenueScene } from "./scenes";
import { Ground } from "./parts";
import { FILM, FPS } from "./schedule";

export type InvitationProps = {
  /** Soundtrack, as a path inside public/ (e.g. "audio/film.mp3"), or null for a silent film. */
  audio: string | null;
};

const frames = (seconds: number) => Math.round(seconds * FPS);

function Soundtrack({ src }: { src: string }) {
  const { durationInFrames, fps } = useVideoConfig();
  return (
    <Audio
      src={staticFile(src)}
      volume={(frame) =>
        interpolate(frame, [durationInFrames - 3 * fps, durationInFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
}

/** The invitation as a sixty-second film: nine scenes over one continuous ground. */
export function Invitation({ audio }: InvitationProps) {
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
        <Series.Sequence durationInFrames={frames(FILM.meeting.seconds)}>
          <MeetingScene />
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
      {audio && <Soundtrack src={audio} />}
    </AbsoluteFill>
  );
}

// Only used when public/audio/wedding.mp3 existed at build time.
// The music is muted by default. The gate tap starts it silently (browsers
// only allow audio to start inside a tap); the floating toggle unmutes it.

let audio: HTMLAudioElement | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

function player() {
  if (!audio) {
    audio = new Audio("/audio/wedding.mp3");
    audio.loop = true;
    audio.volume = 0.25;
    audio.muted = true;
    for (const event of ["play", "pause", "volumechange"]) audio.addEventListener(event, notify);
  }
  return audio;
}

const play = () =>
  player()
    .play()
    .catch(() => {
      // blocked or failed to load: the invitation carries on in silence
    });

/** Call from inside a tap or key press: starts playback, still muted. */
export function unlockMusic() {
  void play();
}

export function toggleMusic() {
  const a = player();
  if (a.muted || a.paused) {
    a.muted = false;
    void play();
  } else {
    a.muted = true;
  }
  notify();
}

export const musicIsOn = () => audio !== null && !audio.muted && !audio.paused;

export function subscribeToMusic(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

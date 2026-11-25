"""Composes the film's soundtrack: public/audio/film.wav (then ffmpeg makes the mp3).

An original 60-second piece, synthesised from scratch so there is nothing to
license: a tanpura drone, two shehnai-like reeds playing a melody in Raga
Bhupali, and a keherwa rhythm with manjira. Run:  python3 scripts/film-music.py
"""
import wave
import numpy as np

SR = 44100
SECONDS = 60.0
N = int(SR * SECONDS)
t = np.arange(N) / SR
rng = np.random.default_rng(12)

SA = 293.66  # D4
BEAT = 0.625  # 96 beats a minute
INTRO = 5.0  # free-time opening, no drums (the invocation scene)
semi = lambda n: SA * 2 ** (n / 12)


def place(track, sound, at, gain=1.0):
    i = int(at * SR)
    if i >= N:
        return
    sound = sound[: N - i]
    track[i : i + len(sound)] += sound * gain


def smooth(x, seconds):
    k = np.exp(-np.arange(int(seconds * SR * 5)) / (seconds * SR))
    k /= k.sum()
    return np.convolve(x, k)[: len(x)]


# ── melody: (semitones above Sa, length) ─────────────────────────────────────
OPENING = [(0, 1.2), (4, 0.8), (7, 1.4), (4, 0.6), (2, 0.5), (0, 0.5)]  # seconds
PHRASES = {  # beats; each line is one cycle of eight
    "A": [(4, 1), (2, 0.5), (0, 0.5), (2, 1), (4, 1), (7, 2), (4, 1), (2, 1)],
    "B": [(7, 1), (9, 1), (12, 2), (9, 0.5), (7, 0.5), (4, 1), (7, 2)],
    "C": [(12, 1), (14, 0.5), (12, 0.5), (9, 1), (7, 1), (4, 0.5), (7, 0.5), (9, 1), (12, 2)],
    "D": [(4, 0.5), (7, 0.5), (9, 0.5), (12, 0.5), (14, 1), (12, 1), (9, 0.5), (7, 0.5), (4, 1), (2, 1), (0, 1)],
    "E": [(12, 1), (9, 1), (7, 1), (4, 1), (2, 1), (0, 3)],
}
ORDER = "ABACDBCDACE"

notes = [(n, d) for n, d in OPENING]
for name in ORDER:
    notes += [(n, d * BEAT) for n, d in PHRASES[name]]

freq = np.zeros(N)
level = np.zeros(N)
at = 0.0
for n, d in notes:
    a, b = int(at * SR), min(N, int((at + d) * SR))
    freq[a:b] = semi(n)
    level[a:b] = 1.0
    level[a : a + int(0.02 * SR)] = 0.55  # a small dip marks each new note
    at += d
freq[freq == 0] = SA
# breath at the end of every cycle
for c in range(len(ORDER) + 1):
    end = INTRO + c * 8 * BEAT if c else INTRO
    a = int((end - 0.16) * SR)
    level[a : int(end * SR)] *= np.linspace(1, 0.15, int(end * SR) - a)

freq = smooth(freq, 0.022)  # meend: notes slide into each other
level = smooth(level, 0.012)
vibrato = 1 + 0.0055 * np.sin(2 * np.pi * 5.4 * t) * smooth(level, 0.25)


def reed(freq_curve, partials):
    phase = 2 * np.pi * np.cumsum(freq_curve) / SR
    return sum(a * np.sin(k * phase) for k, a in enumerate(partials, start=1))


BRIGHT = [1, 0.9, 0.75, 0.8, 0.6, 0.5, 0.35, 0.3, 0.2, 0.15, 0.1, 0.08]
lead = reed(freq * vibrato, BRIGHT) * level
# the second shehnai, an octave below and a touch behind
second = np.roll(reed(freq * 0.5 * 1.003 * vibrato, BRIGHT[:9]) * level, int(0.022 * SR))

# ── tanpura drone: Pa Sa Sa Sa(low), each string ringing on ───────────────────
drone = np.zeros(N)
string_t = np.arange(int(3.2 * SR)) / SR
for i, start in enumerate(np.arange(0, SECONDS, 0.78)):
    f = [semi(-5), semi(0), semi(0), semi(-12)][i % 4]
    pluck = sum(
        (1 / k**0.8) * np.sin(2 * np.pi * f * k * string_t) * np.exp(-string_t * (0.9 + 0.35 * k))
        for k in range(1, 13)
    )
    pluck *= 1 - np.exp(-string_t * 60)
    place(drone, pluck, start, 0.5)

# ── rhythm: keherwa ──────────────────────────────────────────────────────────
def bass(strength=1.0):
    x = np.arange(int(0.45 * SR)) / SR
    f = 62 + 95 * np.exp(-x * 20)
    return strength * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 8.5)


def ring(strength=1.0):
    x = np.arange(int(0.3 * SR)) / SR
    tone = sum(a * np.sin(2 * np.pi * SA * 2 * m * x) for m, a in ((1, 1), (2.0, 0.5), (3.01, 0.3)))
    snap = rng.standard_normal(len(x)) * np.exp(-x * 90) * 0.5
    return strength * (tone * np.exp(-x * 20) + snap)


def slap(strength=1.0):
    x = np.arange(int(0.12 * SR)) / SR
    return strength * np.diff(rng.standard_normal(len(x) + 1)) * np.exp(-x * 45)


def chime():
    x = np.arange(int(0.6 * SR)) / SR
    return (np.sin(2 * np.pi * 2637 * x) + 0.7 * np.sin(2 * np.pi * 3951 * x)) * np.exp(-x * 11)


def shake():
    x = np.arange(int(0.07 * SR)) / SR
    return np.diff(rng.standard_normal(len(x) + 1)) * np.exp(-x * 60)


low, high, left, right = (np.zeros(N) for _ in range(4))
cycle = 0
start = INTRO
while start < SECONDS:
    b = lambda beat: start + (beat - 1) * BEAT
    fill = cycle % 4 == 3  # a busier turn-around every fourth cycle
    place(low, bass(), b(1))
    place(high, ring(), b(1))
    place(low, bass(0.55), b(2))
    place(high, ring(0.8), b(3))
    place(high, ring(0.45), b(4))
    place(low, bass(0.5), b(4.5))
    place(high, ring(0.8), b(5))
    place(high, slap(0.9), b(6))
    place(low, bass(0.9), b(7))
    place(high, ring(0.7), b(7))
    place(high, ring(0.8), b(8))
    if fill:
        for beat in (7.5, 8.25, 8.5, 8.75):
            place(high, ring(0.6), b(beat))
        place(low, bass(0.7), b(8.5))
    for beat in (1, 3, 5, 7):
        place(left, chime(), b(beat), 0.5)
    for half in np.arange(1, 9, 0.5):
        place(right, shake(), b(half), 0.35 if half % 1 else 0.2)
    start += 8 * BEAT
    cycle += 1

# ── mix, a little room, and out ──────────────────────────────────────────────
def room(x, seed):
    r = np.random.default_rng(seed)
    tail = np.arange(int(1.4 * SR)) / SR
    impulse = r.standard_normal(len(tail)) * np.exp(-tail * 4.2)
    size = 1 << int(np.ceil(np.log2(len(x) + len(impulse))))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(impulse, size), size)[: len(x)]
    return wet / np.max(np.abs(wet))


dry_l = 0.30 * lead + 0.10 * second + 0.20 * drone + 0.55 * low + 0.22 * high + 0.05 * left
dry_r = 0.30 * lead + 0.16 * second + 0.20 * drone + 0.55 * low + 0.22 * high + 0.05 * right
melodic = 0.30 * lead + 0.13 * second + 0.1 * drone + 0.08 * high
out = np.stack([dry_l + 0.35 * room(melodic, 1), dry_r + 0.35 * room(melodic, 2)], axis=1)

fade = int(0.4 * SR)
out[:fade] *= np.linspace(0, 1, fade)[:, None]
out[-fade:] *= np.linspace(1, 0, fade)[:, None]
out = np.tanh(out / np.max(np.abs(out)) * 1.25) / np.tanh(1.25) * 0.89

with wave.open("public/audio/film.wav", "wb") as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes((out * 32767).astype("<i2").tobytes())
print("wrote public/audio/film.wav", f"peak {np.max(np.abs(out)):.2f}", f"rms {np.sqrt(np.mean(out**2)):.3f}")

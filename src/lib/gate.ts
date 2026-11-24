// The gate's state lives on <html data-gate="…"> so CSS can act on it before
// React hydrates: "skip" (returning visitor), "opening" (doors swinging), "open".

const KEY = "gate-opened";
const EVENT = "gate:opening";

/** Runs before first paint (see layout.tsx) so returning visitors never see the doors. */
export const GATE_BOOT_SCRIPT = `try{if(sessionStorage.getItem("${KEY}"))document.documentElement.dataset.gate="skip"}catch(e){}`;

export function gateSeenThisSession() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/** The doors have started to swing: scenes behind them may begin. */
export function announceGateOpening() {
  document.documentElement.dataset.gate = "opening";
  window.dispatchEvent(new Event(EVENT));
}

/** The gate is gone: unlock scrolling and remember it for this session. */
export function markGateOpen() {
  if (!document.documentElement.dataset.gate) window.dispatchEvent(new Event(EVENT));
  document.documentElement.dataset.gate = "open";
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // private mode: the gate simply shows again next time
  }
}

/** Calls back once the gate starts opening, or at once if it already has or was skipped. */
export function whenGateOpens(callback: () => void) {
  if (document.documentElement.dataset.gate) {
    callback();
    return () => {};
  }
  window.addEventListener(EVENT, callback, { once: true });
  return () => window.removeEventListener(EVENT, callback);
}

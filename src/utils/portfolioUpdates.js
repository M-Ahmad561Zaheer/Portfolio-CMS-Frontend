const CHANNEL_NAME = "portfolio-content-updates";
const STORAGE_KEY = "portfolio-profile-updated";
const UPDATE_EVENT = "portfolio:profile-updated";

export function notifyProfileUpdated() {
  const update = { type: "profile", updatedAt: Date.now() };

  window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: update }));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(update));
  } catch {
    // Live updates still work through BroadcastChannel when storage is unavailable.
  }

  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(update);
    channel.close();
  }
}

export function subscribeToProfileUpdates(callback) {
  const handleStorage = (event) => {
    if (event.key === STORAGE_KEY) callback();
  };
  const handleUpdate = () => callback();
  const channel = "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL_NAME) : null;

  window.addEventListener("storage", handleStorage);
  window.addEventListener(UPDATE_EVENT, handleUpdate);
  if (channel) channel.addEventListener("message", handleUpdate);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(UPDATE_EVENT, handleUpdate);
    if (channel) channel.close();
  };
}

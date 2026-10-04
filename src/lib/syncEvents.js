/**
 * Broadcast synchronization event across components, windows, and browser tabs
 * when Admin changes Products, Categories, or other data.
 */
export function notifyDataUpdated(detail = {}) {
  const payload = {
    timestamp: Date.now(),
    ...detail,
  };

  try {
    // 1. Dispatch custom event for current window
    window.dispatchEvent(new CustomEvent('livkam_data_updated', { detail: payload }));
  } catch (e) {
    console.warn('Local event dispatch failed:', e);
  }

  try {
    // 2. Cross-tab synchronization via BroadcastChannel
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('livkam_sync_channel');
      channel.postMessage({ type: 'DATA_UPDATED', ...payload });
      // Keep channel open briefly then close
      setTimeout(() => {
        try { channel.close(); } catch (_) {}
      }, 500);
    }
  } catch (e) {
    console.warn('BroadcastChannel sync failed:', e);
  }
}

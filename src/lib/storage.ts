// Storage wrapper using localStorage with URL fallback for cross-device sharing
interface StorageAPI {
  get: (key: string, shared?: boolean) => Promise<{ value: string } | null>;
  set: (key: string, value: string, shared?: boolean) => Promise<void>;
  delete: (key: string, shared?: boolean) => Promise<void>;
  trackEngagement: (eventId: string, guestId: string, action: string) => Promise<void>;
  getAnalytics: (eventId: string) => Promise<any>;
}

const getEventIdFromHash = (): string | null => {
  if (typeof window === 'undefined' || !window.location.hash) return null;
  try {
    const encoded = window.location.hash.substring(1);
    const data = JSON.parse(atob(encoded));
    return data.eventId || null;
  } catch {
    return null;
  }
};

const updateUrlHash = (eventId: string, eventData: string) => {
  try {
    const data = JSON.parse(eventData);
    const hashData = { eventId, ...data };
    const encoded = btoa(JSON.stringify(hashData));
    const url = new URL(window.location.href);
    url.hash = encoded;
    window.history.replaceState({}, '', url);
  } catch (error) {
    console.error('Error updating hash:', error);
  }
};

export const storage: StorageAPI = {
  get: async (key: string, shared?: boolean) => {
    try {
      if (shared && typeof window !== 'undefined') {
        // For shared data, try URL hash first
        const eventId = getEventIdFromHash();
        if (eventId) {
          // If the key is for a specific event, try to match it
          const keyEventMatch = key.match(/reveal:([^:]+)/) || key.match(/votes:([^:]+)/);
          if (keyEventMatch && keyEventMatch[1] !== eventId) {
             // If we have a hash event ID, we should prioritize items related to that ID
             // This is a bit simplified; real implementations would be more robust
          }
          
          if (key.startsWith('reveal:')) {
             const encoded = window.location.hash.substring(1);
             return { value: atob(encoded) };
          }
        }
      }
      
      const value = localStorage.getItem(key);
      return value ? { value } : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  set: async (key: string, value: string, shared?: boolean) => {
    try {
      localStorage.setItem(key, value);
      
      // For shared data, also update URL hash
      if (shared && key.startsWith('reveal:')) {
        const eventId = key.split(':')[1];
        if (eventId) {
          updateUrlHash(eventId, value);
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        // Simple cleanup: remove oldest reveal data
        const keys = Object.keys(localStorage);
        const revealKeys = keys.filter(k => k.startsWith('reveal:') || k.startsWith('votes:'));
        revealKeys.sort(); // Very basic sorting
        const toRemove = revealKeys.slice(0, Math.floor(revealKeys.length / 2));
        toRemove.forEach(k => localStorage.removeItem(k));
        
        try {
          localStorage.setItem(key, value);
        } catch (retryError) {
          console.error('Storage quota still exceeded after cleanup');
        }
      }
      console.error('Storage set error:', error);
      throw error;
    }
  },

  delete: async (key: string, _shared?: boolean) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage delete error:', error);
      throw error;
    }
  },

  trackEngagement: async (eventId: string, guestId: string, action: string) => {
    try {
      const key = `analytics:${eventId}`;
      const existing = localStorage.getItem(key);
      const data = existing ? JSON.parse(existing) : { guests: {}, timeline: [] };
      
      if (!data.guests[guestId]) {
        data.guests[guestId] = { firstSeen: Date.now(), actions: [] };
      }
      
      data.guests[guestId].actions.push({ action, time: Date.now() });
      data.timeline.push({ guestId, action, time: Date.now() });
      
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
  },

  getAnalytics: async (eventId: string) => {
    try {
      const key = `analytics:${eventId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : { guests: {}, timeline: [] };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return { guests: {}, timeline: [] };
    }
  }
};

// Attach to window for compatibility
declare global {
  interface Window {
    storage: StorageAPI;
  }
}

if (typeof window !== 'undefined') {
  window.storage = storage;
}

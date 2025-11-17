// Storage wrapper using localStorage with URL fallback for cross-device sharing
interface StorageAPI {
  get: (key: string, isPublic?: boolean) => Promise<{ value: string } | null>;
  set: (key: string, value: string, isPublic?: boolean) => Promise<void>;
  delete: (key: string, isPublic?: boolean) => Promise<void>;
}

// Helper to encode data in URL hash for cross-device sharing
const encodeToHash = (key: string, value: string) => {
  if (key.startsWith('reveal:')) {
    try {
      const data = JSON.parse(value);
      const encoded = btoa(JSON.stringify(data));
      const url = new URL(window.location.href);
      url.hash = encoded;
      window.history.replaceState({}, '', url);
    } catch (error) {
      console.error('Error encoding to hash:', error);
    }
  }
};

const decodeFromHash = (key: string): string | null => {
  if (key.startsWith('reveal:') && window.location.hash) {
    try {
      const encoded = window.location.hash.substring(1);
      return atob(encoded);
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const storage: StorageAPI = {
  get: async (key: string, isPublic?: boolean) => {
    try {
      // For public data, try URL hash first (for cross-device sharing)
      if (isPublic) {
        const hashData = decodeFromHash(key);
        if (hashData) {
          return { value: hashData };
        }
      }
      
      const value = localStorage.getItem(key);
      return value ? { value } : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  set: async (key: string, value: string, isPublic?: boolean) => {
    try {
      localStorage.setItem(key, value);
      
      // For public event data, also encode in URL hash for cross-device sharing
      if (isPublic && key.startsWith('reveal:')) {
        encodeToHash(key, value);
      }
    } catch (error) {
      console.error('Storage set error:', error);
      throw error;
    }
  },

  delete: async (key: string, _isPublic?: boolean) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage delete error:', error);
      throw error;
    }
  }
};

// Attach to window for compatibility with the original code
declare global {
  interface Window {
    storage: StorageAPI;
  }
}

if (typeof window !== 'undefined') {
  window.storage = storage;
}

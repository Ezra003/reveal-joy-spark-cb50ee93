// Simple storage wrapper using localStorage
// This can be replaced with a real backend storage solution

interface StorageAPI {
  get: (key: string, isPublic?: boolean) => Promise<{ value: string } | null>;
  set: (key: string, value: string, isPublic?: boolean) => Promise<void>;
  delete: (key: string, isPublic?: boolean) => Promise<void>;
}

export const storage: StorageAPI = {
  get: async (key: string, _isPublic?: boolean) => {
    try {
      const value = localStorage.getItem(key);
      return value ? { value } : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  set: async (key: string, value: string, _isPublic?: boolean) => {
    try {
      localStorage.setItem(key, value);
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

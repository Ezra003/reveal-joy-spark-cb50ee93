// src/config/env.ts
const requiredEnvVars = [] as const;

export const env = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Gender Reveal Party',
  API_URL: import.meta.env.VITE_API_URL,
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

// Validate required env vars
requiredEnvVars.forEach((key) => {
  if (!env[key]) {
    console.warn(`Missing recommended environment variable: ${key}`);
  }
});

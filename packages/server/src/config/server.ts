export const SERVER_CONFIG = {
  port: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 3000,
  host: process.env.SERVER_HOST || '0.0.0.0',
} as const;

import { registerAs } from '@nestjs/config';

export default registerAs('logto', () => ({
  endpoint: process.env.LOGTO_ENDPOINT || 'https://auth.xiajia.im',
  appId: process.env.LOGTO_APP_ID || '',
  appSecret: process.env.LOGTO_APP_SECRET || '',
  baseUrl: process.env.LOGTO_BASE_URL || 'http://localhost:3001',
  resource: process.env.LOGTO_RESOURCE || 'http://localhost:3001/api',
}));

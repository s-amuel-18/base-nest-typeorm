import { OAuth2Client } from 'google-auth-library';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

export const googleAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

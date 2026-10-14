import * as dotenv from 'dotenv';
import * as path from 'path';
import { getEnvironments, Environment } from './environments';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const ENVIRONMENTS = getEnvironments();

const env = process.env.ENV || 'dev';

if (!(env in ENVIRONMENTS)) {
  throw new Error(`Unknown environment "${env}". Valid: ${Object.keys(ENVIRONMENTS).join(', ')}`);
}

const baseUrl = ENVIRONMENTS[env as Environment];
if (!baseUrl) {
  throw new Error(
    `No base URL configured for environment "${env}". ` +
    `Set ${env.toUpperCase()}_BASE_URL in .env`
  );
}

const parsedUrl = new URL(baseUrl);
if (parsedUrl.protocol !== 'https:' || parsedUrl.username || parsedUrl.password) {
  throw new Error('Base URL must use HTTPS and must not contain credentials.');
}

const prefix = env.toUpperCase();
const specificUsername = process.env[`${prefix}_APP_USERNAME`] || '';
const specificPassword = process.env[`${prefix}_APP_PASSWORD`] || '';
if (!!specificUsername !== !!specificPassword) {
  throw new Error(`Configure both ${prefix}_APP_USERNAME and ${prefix}_APP_PASSWORD; partial account overrides are not allowed.`);
}

export const config = {
  env,
  baseUrl,
  timeouts: {
    element:  15_000,
    page:     30_000,
    wait:     20_000,
  },
  credentials: {
    username: specificUsername || process.env.APP_USERNAME || '',
    password: specificPassword || process.env.APP_PASSWORD || '',
  },
};

export function validateCredentials(): void {
  if (!config.credentials.username || !config.credentials.password) {
    throw new Error(`Configure ${prefix}_APP_USERNAME/PASSWORD or APP_USERNAME/PASSWORD before browser execution.`);
  }
}

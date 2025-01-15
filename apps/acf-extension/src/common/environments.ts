/* eslint-disable prefer-destructuring */
const VARIANT = process.env.NX_PUBLIC_VARIANT;
const OPTIONS_PAGE_URL = process.env.PUBLIC_URL;
const UNINSTALL_URL = process.env.UNINSTALL_URL;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const MEASUREMENT_ID = process.env.MEASUREMENT_ID;
const API_SECRET = process.env.API_SECRET;
const EDGE_OAUTH_CLIENT_ID = process.env.EDGE_OAUTH_CLIENT_ID;
const FIREBASE_API_KEY = process.env.NX_PUBLIC_FIREBASE_API_KEY;
const FIREBASE_DATABASE_URL = process.env.NX_PUBLIC_FIREBASE_DATABASE_URL;
const FIREBASE_PROJECT_ID = process.env.NX_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_BUCKET = process.env.NX_PUBLIC_FIREBASE_BUCKET;
const FIREBASE_FUNCTIONS_URL = process.env.NX_PUBLIC_FIREBASE_FUNCTIONS_URL ?? 'https://us-central1-auto-clicker-autofill.cloudfunctions.net';
const RELEASE_VERSION = process.env.NX_PUBLIC_RELEASE_VERSION;
const SENTRY_DSN = process.env.NX_PUBLIC_SENTRY_DSN;
export {
  API_SECRET,
  DISCORD_CLIENT_ID,
  EDGE_OAUTH_CLIENT_ID,
  FIREBASE_API_KEY,
  FIREBASE_BUCKET,
  FIREBASE_DATABASE_URL,
  FIREBASE_FUNCTIONS_URL,
  FIREBASE_PROJECT_ID,
  MEASUREMENT_ID,
  OPTIONS_PAGE_URL,
  RELEASE_VERSION,
  SENTRY_DSN,
  UNINSTALL_URL,
  VARIANT,
};

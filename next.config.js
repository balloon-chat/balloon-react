require('dotenv')
  .config();
module.exports = {
  env: {
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    DATABASE_URL: process.env.DATABASE_URL,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    APP_ID: process.env.APP_ID,
    MEASUREMENT_ID: process.env.MEASUREMENT_ID,
    BASE_URL: process.env.BASE_URL,
    TEMPLATE_USER_ICON_URL: process.env.TEMPLATE_USER_ICON_URL,
    // API Endpoints
    SESSION_LOGIN_API_URL: process.env.SESSION_LOGIN_API_URL,
    SESSION_LOGOUT_API_URL: process.env.SESSION_LOGOUT_API_URL,
    GET_USER_INFO_API_URL: process.env.GET_USER_INFO_API_URL,
    OAUTH_GOOGLE_LOGIN_URL: process.env.OAUTH_GOOGLE_LOGIN_URL,
    OAUTH_GOOGLE_LOGIN_RESULT_URL: process.env.OAUTH_GOOGLE_LOGIN_RESULT_URL,
  },
  images: {
    domains: ['firebasestorage.googleapis.com']
  },
};

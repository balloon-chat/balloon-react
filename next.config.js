require('dotenv').config();
module.exports = {
  distDir: 'build',  // Google App Engineが.nextディレクトリを読み込め無いため、buildに変更する必要がある。
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    DATABASE_URL: process.env.DATABASE_URL,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    APP_ID: process.env.APP_ID,
    MEASUREMENT_ID: process.env.MEASUREMENT_ID,
    HOST_NAME: process.env.HOST_NAME,
    BASE_URL: process.env.BASE_URL,
    TEMPLATE_USER_ICON_URL: process.env.TEMPLATE_USER_ICON_URL,
    // API Endpoints
    SESSION_LOGIN_API_URL: process.env.SESSION_LOGIN_API_URL,
    SESSION_LOGOUT_API_URL: process.env.SESSION_LOGOUT_API_URL,
    GET_USER_INFO_API_URL: process.env.GET_USER_INFO_API_URL,
    OAUTH_GOOGLE_LOGIN_URL: process.env.OAUTH_GOOGLE_LOGIN_URL,
    OAUTH_GOOGLE_LOGIN_RESULT_URL: process.env.OAUTH_GOOGLE_LOGIN_RESULT_URL,
    // Invitation
    CREATE_INVITATION_API_URL: process.env.CREATE_INVITATION_API_URL,
    INVITATION_CODE_API_URL: process.env.INVITATION_CODE_API_URL,
    INVITATION_TOPIC_API_URL: process.env.INVITATION_TOPIC_API_URL,
    DELETE_INVITATION_API_URL: process.env.DELETE_INVITATION_API_URL,
  },
  images: {
    domains: ['firebasestorage.googleapis.com']
  },
};

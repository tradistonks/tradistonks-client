
const withLess = require("next-with-less");
const path = require("path");

const pathToLessFileWithVariables = path.resolve("styles/antd-variables.less")

module.exports = withLess({
  serverRuntimeConfig: {
    API_INTERNAL_HOST: process.env.API_INTERNAL_HOST,
  },
  publicRuntimeConfig: {
    API_EXTERNAL_HOST: process.env.API_EXTERNAL_HOST,

    OAUTH2_LOCAL_URL: process.env.OAUTH2_LOCAL_URL,
    OAUTH2_LOCAL_CLIENT_ID: process.env.OAUTH2_LOCAL_CLIENT_ID,
    OAUTH2_LOCAL_REDIRECT_URL: process.env.OAUTH2_LOCAL_REDIRECT_URL,
    OAUTH2_PKCE_STATE: process.env.OAUTH2_PKCE_STATE,
  },
  future: {
    webpack5: true,
  },
});

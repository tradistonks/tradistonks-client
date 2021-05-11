module.exports = {
  serverRuntimeConfig: {
    API_INTERNAL_HOST: process.env.API_INTERNAL_HOST,
  },
  publicRuntimeConfig: {
    API_EXTERNAL_HOST: process.env.API_EXTERNAL_HOST,
  },
  future: {
    webpack5: true,
  },
};

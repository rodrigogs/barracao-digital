const {
  NODE_ENV,
  VUE_APP_API_URL,
} = process.env;

const API_URL = `${VUE_APP_API_URL}/${NODE_ENV}`;

export {
  NODE_ENV,
  API_URL,
};

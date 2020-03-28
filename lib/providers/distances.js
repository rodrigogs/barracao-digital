const { Client } = require('@googlemaps/google-maps-services-js');
const { GOOGLE_DISTANCES_MATRIX_API_KEY } = require('../config');

module.exports = new Client({
  key: GOOGLE_DISTANCES_MATRIX_API_KEY,
});

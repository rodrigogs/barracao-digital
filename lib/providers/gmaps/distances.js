import { Client } from '@googlemaps/google-maps-services-js'
import { GOOGLE_DISTANCES_MATRIX_API_KEY } from '../../config'

const client = new Client({
  key: GOOGLE_DISTANCES_MATRIX_API_KEY,
})

export default client

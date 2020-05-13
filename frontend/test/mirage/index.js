import { Server, Model } from 'miragejs'
import { env } from '../../cypress.json'

export const startMirage = ({ environment = 'test' } = {}) => {
  return new Server({
    environment,
    models: {
      movie: Model
    },
    routes() {
      this.urlPrefix = env.apiUrl
      this.namespace = 'api'

      this.resource('movie')
    }
  })
}

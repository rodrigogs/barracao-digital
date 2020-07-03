import crypto from 'crypto'
import dispatch from './dispatcher'

const service = {
  async login({ username, password }) {
    return service.authorize({ username, password })
  },

  async authorize({ username, password }) {
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex')
    const user = await dispatch('doctors', 'getOneByUsername')(username)

    if (!user || user.password !== hashedPassword) {
      return false
    }

    return user
  },
}

export default service

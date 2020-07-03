import OpenTok from 'opentok'
import { OPENTOK_API_KEY, OPENTOK_API_SECRET } from '../../config'

const opentok = new OpenTok(OPENTOK_API_KEY, OPENTOK_API_SECRET)

export const createSession = () => {
  return new Promise((resolve, reject) => {
    opentok.createSession({}, (err, session) => {
      if (err) return reject(err)
      return resolve(session)
    })
  })
}

export const generateToken = (sessionId, options = {}) => {
  return opentok.generateToken(sessionId, options)
}

import md5 from 'crypto-js/md5'
import axios from 'axios'

const gravatarLink = (email) => {
  if (!email) return null
  const emailMd5 = md5(email.trim())
  return `https://www.gravatar.com/avatar/${emailMd5}.png?d=404`
}

const checkGravatar = async (email) => {
  try {
    await axios.get(gravatarLink(email))
    return true
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return false
    }
    throw err
  }
}

const robohashLink = (email) => `https://robohash.org/${email}`

export default async (emailOrHash) => {
  if (await checkGravatar(emailOrHash)) return gravatarLink(emailOrHash)
  return robohashLink(emailOrHash)
}

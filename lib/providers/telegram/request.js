import axios from 'axios'
import { TELEGRAM_TOKEN } from '../../config'

const request = axios.create({
  baseURL: `https://api.telegram.org/bot${TELEGRAM_TOKEN}`,
})

request.defaults.headers.common['Content-Type'] = 'application/json'

export default request

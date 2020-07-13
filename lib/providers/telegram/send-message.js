import qs from 'qs'
import request from './request'

export default async function ({ chatId, text }) {
  const queryString = qs.stringify({
    chat_id: chatId,
    text: text.replace(/\./g, '\\.'),
    parse_mode: 'MarkdownV2',
  })
  const { data } = await request.get(`sendMessage?${queryString}`)
  return data
}

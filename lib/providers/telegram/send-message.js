import qs from 'qs'
import request from './request'

const escapeChars = ['_', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!']

const normalizeText = (text) => {
  let result = text
  for (const char of escapeChars) {
    result = result.replace(new RegExp(`\\${char}`, `g`), `\\${char}`)
  }
  return result
}

export default async ({ chatId, message, disableWebPagePreview = false }) => {
  const queryString = qs.stringify({
    chat_id: chatId,
    text: normalizeText(message),
    disable_web_page_preview: disableWebPagePreview,
    parse_mode: 'MarkdownV2',
  })
  const { data } = await request.get(`sendMessage?${queryString}`)
  return data
}

import qs from 'qs'
import request from './request'

const escapeChars = [
  '_',
  '[',
  ']',
  '(',
  ')',
  '~',
  '`',
  '>',
  '#',
  '+',
  '-',
  '=',
  '|',
  '{',
  '}',
  '.',
  '!',
]

const normalizeText = (text) => {
  let result = text
  for (const char of escapeChars) {
    result = result.replace(new RegExp(`\\${char}`, `g`), `\\${char}`)
  }
  return result
}

export default async function ({ chatId, text }) {
  const queryString = qs.stringify({
    chat_id: chatId,
    text: normalizeText(text),
    parse_mode: 'MarkdownV2',
  })
  const { data } = await request.get(`sendMessage?${queryString}`)
  return data
}

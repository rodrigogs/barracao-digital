import * as telegramProvider from '../providers/telegram'

const filterChatsByTitle = (events, title) =>
  events.filter((event) => event.message.chat.title === title)

const findChatIdByTitleAndType = (events, title, type) => {
  const event = filterChatsByTitle(events, title).find((event) => event.message.chat.type === type)
  return event ? event.message.chat.id : null
}

const repository = {
  /**
   * @param {String} title
   * @returns {Promise<String|null>}
   */
  async findGroupIdByChatTitle(title) {
    const { result: events } = await telegramProvider.getUpdates()
    return (
      findChatIdByTitleAndType(events, title, 'supergroup') ||
      findChatIdByTitleAndType(events, title, 'group')
    )
  },

  /**
   * @param {String} chatId
   * @param {String} message
   * @param {Boolean} disableWebPagePreview
   * @returns {Promise<*>}
   */
  async sendMessage({ chatId, message, disableWebPagePreview }) {
    return telegramProvider.sendMessage({ chatId, message, disableWebPagePreview })
  },
}

export default repository

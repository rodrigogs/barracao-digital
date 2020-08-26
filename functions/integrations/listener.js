import { responseBuilder, getRequestContext } from '../helpers'
import telegramRepository from '../../lib/repository/telegram.repository'
import configsService from '../../lib/services/configs.service'
import facilitiesRepository from '../../lib/repository/facilities.repository'

export const handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event)
    let event_type = event.headers['X-GitHub-Event']
    let payload = requestContext.body
    let message
    switch (event_type) {
      case 'issues':
        message = `Issue named "${payload.issue.title}"#${payload.issue.number} was ${payload.action} by *${payload.sender.login}* on repository *${payload.repository.name}*. See it here: ${payload.issue.html_url}`
        break
      case 'issue_comment':
        message = `*${payload.repository.name}* -> A comment was ${payload.action} to the issue "${payload.issue.title}"#${payload.issue.number} by *${payload.comment.user.login}*: "${payload.comment.body}"`
        break
      case 'commit_comment':
        message = `*${payload.repository.name}* -> A comment was ${payload.action} by *${payload.comment.user.login}* at commit ${payload.comment.html_url}`
        break
      case 'pull_request':
        message = `A pull request was ${payload.action} on repository *${payload.repository.name}* by *${payload.sender.login}*: ${payload.pull_request.html_url}`
        break
      case 'push':
        message = `User *${payload.pusher.name}* has pushed modifications on repository *${payload.repository.name}*. See the changes here: ${payload.compare}`
        break
      case 'project_card':
        message = `Card "${
          payload.project_card.note ? payload.project_card.note : payload.project_card.id
        }" was ${payload.action} by *${payload.project_card.creator.login}* in repository *${
          payload.repository.name
        }*. See it here: ${payload.repository.html_url}`
        break
      default:
        message = 'GitHub repo has been awakened by some event yet unknown to me :('
    }

    const facility = await facilitiesRepository.getOneByOrigin(process.env.FACILITY_ORIGIN)
    if (!facility) {
      return responseBuilder.errors.notFound('Facility not found')
    }
    let chatId = await telegramRepository.findGroupIdByChatTitle(facility.name) //-1001496854444
    if (!chatId) {
      const facilityChatConfig = await configsService.retrieveFacilityChatId(facility.origin)
      if (facilityChatConfig) chatId = facilityChatConfig.chatId
    }

    await telegramRepository.sendMessage({ chatId, message })
    return responseBuilder.success.noContent()
  } catch (err) {
    console.error(err)
  }
}

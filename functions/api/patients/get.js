import patientsService from 'barracao-digital/services/patients.service'
import { getRequestContext, responseBuilder } from '../../helpers'

const getPatientByTicket = async (user, ticket) => {
  const patient = await patientsService.getOneByTicket(ticket)
  if (!patient) return responseBuilder.errors.notFound('Paciente não encontrado')
  return responseBuilder.success.ok({ body: patient })
}

const getByOriginCep = async (cep, user, { status, timeWaiting, lastEvaluatedKey, pageSize }) => {
  if (!user.master && user.cep !== cep) {
    return responseBuilder.errors.forbidden('Você só pode visualizar dados da sua região')
  }
  if (status && !timeWaiting) {
    return responseBuilder.success.ok({
      body: await patientsService.getAllByOriginCepAndStatus(cep, status, {
        lastEvaluatedKey,
        pageSize,
      }),
    })
  }
  if (timeWaiting && !status) {
    return responseBuilder.success.ok({
      body: await patientsService.getAllByOriginCepAndTimeWaiting(cep, timeWaiting, {
        lastEvaluatedKey,
        pageSize,
      }),
    })
  }
  if (status && timeWaiting) {
    return responseBuilder.success.ok({
      body: await patientsService.getAllByOriginCepAndStatusAndTimeWaiting(
        cep,
        status,
        timeWaiting,
        { lastEvaluatedKey, pageSize }
      ),
    })
  }
  return responseBuilder.success.ok({
    body: await patientsService.getAllByOriginCep(cep, { lastEvaluatedKey, pageSize }),
  })
}

export const handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event)
    const { consumer: user, pathParameters, queryStringParameters } = requestContext

    const { cep, ticket } = pathParameters || {}
    const { status, timeWaiting, lastEvaluatedKey, pageSize } = queryStringParameters || {}

    const parsedLastKey = lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : undefined

    if (ticket) return getPatientByTicket(user, ticket)

    if (cep) {
      return getByOriginCep(cep, user, {
        status,
        timeWaiting,
        lastEvaluatedKey: parsedLastKey,
        pageSize,
      })
    }

    return responseBuilder.errors.badRequest()
  } catch (err) {
    return responseBuilder.genericError(err)
  }
}

import doctorsService from 'barracao-digital/services/doctors.service'
import { getRequestContext, responseBuilder } from '../../helpers'

export const handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event)

    const { consumer: user, pathParameters, queryStringParameters } = requestContext

    const { master: isMaster, admin: isAdmin } = user
    const { cep, username } = pathParameters || {}
    const { active, lastEvaluatedKey, pageSize } = queryStringParameters || {}
    const parsedLastKey =
      typeof lastEvaluatedKey === 'string' && lastEvaluatedKey.length > 0
        ? JSON.parse(lastEvaluatedKey)
        : undefined

    if (cep) {
      if (!isMaster && !isAdmin && user.cep !== cep) {
        return responseBuilder.errors.forbidden('Você só pode visualizar dados da sua região')
      }
      const results = active
        ? await doctorsService.getAllByCepAndActive(cep, active === 'true', {
            lastEvaluatedKey: parsedLastKey,
            pageSize,
          })
        : await doctorsService.getAllByCep(cep, { lastEvaluatedKey: parsedLastKey, pageSize })
      return responseBuilder.success.ok({
        body: {
          lastEvaluatedKey: results.lastEvaluatedKey,
          items: results.items.map((doctor) => ({ ...doctor, password: undefined })),
        },
      })
    }

    if (username) {
      const doctor = await doctorsService.getOneByUsername(username)
      if (!doctor) return responseBuilder.errors.notFound('Doctor Not Found')
      if (isMaster || (isAdmin && doctor.cep === user.cep) || doctor.username === user.username) {
        return responseBuilder.success.ok({
          body: { ...doctor, password: undefined },
        })
      }
      return responseBuilder.errors.forbidden('Você só pode visualizar dados da sua região')
    }

    const results = await doctorsService.getAll({ lastEvaluatedKey: parsedLastKey, pageSize })
    return responseBuilder.success.ok({
      body: {
        lastEvaluatedKey: results.lastEvaluatedKey,
        items: results.items.map((doctor) => ({ ...doctor, password: undefined })),
      },
    })
  } catch (err) {
    return responseBuilder.genericError(err)
  }
}

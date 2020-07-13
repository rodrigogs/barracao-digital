import { handler as doctorAuthorizer } from './doctor-authorizer'

export const handler = (event, context, callback) => {
  ;(async () => {
    try {
      const doctorAuthorizerResult = await new Promise((resolve) => {
        doctorAuthorizer(event, context, (err, result) => {
          resolve(err || result)
        })
      })

      if (typeof doctorAuthorizerResult === 'string') return callback(doctorAuthorizerResult)

      const user = JSON.parse(doctorAuthorizerResult.context.consumer)
      if (user && !user.master) {
        return callback('Unauthorized')
      }
      return callback(null, doctorAuthorizerResult)
    } catch (err) {
      console.error('MasterAuthorizerError', err)
      return callback('Error')
    }
  })()
}

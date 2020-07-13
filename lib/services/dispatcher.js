import authService from './auth.service'
import configsService from './configs.service'
import conversationService from './conversation.service'
import doctorsService from './doctors.service'
import facilitiesService from './facilities.service'
import jobsService from './jobs.service'
import patientsService from './patients.service'
import pushService from './push.service'

const serviceFactory = (serviceName) =>
  ({
    auth: authService,
    configs: configsService,
    conversation: conversationService,
    doctors: doctorsService,
    facilities: facilitiesService,
    jobs: jobsService,
    patients: patientsService,
    push: pushService,
  }[serviceName])

export default (service, method) => (...args) => {
  const serviceModule = serviceFactory(service)
  if (!serviceModule) throw new Error(`Dispatcher Error: Service ${service} not found`)

  const serviceMethod = serviceModule[method]
  if (!serviceMethod)
    throw new Error(`Dispatcher Error: Method ${method} not found for service ${service}`)

  return serviceMethod(...args)
}

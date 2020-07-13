import { jobsService, doctorsService } from 'barracao-digital/services'

export const handler = async (user) => {
  const currentUser = await doctorsService.getOneByUsername(user.username)
  if (currentUser.active) await doctorsService.alternateActive(user.username)
  await jobsService.removeAlternateDoctorJobSchedule(user)
}

const { patientsService } = require('barracao-digital/services');
const { PATIENT_STATUSES } = require('barracao-digital/enums');
const { getRequestContext, responseBuilder } = require('../../helpers');

const updatePatient = async (patient, _user, body) => {
  const updatedPatient = {
    ...patient,
    ...body,
  };
  return responseBuilder.success.ok({
    body: await patientsService.update(patient.ticket, updatedPatient),
  });
};

module.exports.handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event);
    const {
      consumer: user,
      pathParameters = {},
      body = {},
      resource,
    } = requestContext;
    const { ticket } = pathParameters;

    const patient = await patientsService.getOneByTicket(ticket);
    if (!patient) {
      return responseBuilder.errors.notFound('Paciente não encontrado');
    }
    if (user && (!user.master && (user.cep !== patient.cep))) {
      return responseBuilder.errors.forbidden('Você só pode alterar dados da sua região');
    }

    // /patients/{ticket}/status/ongoing
    if (resource.endsWith('status/ongoing')) {
      return responseBuilder.success
        .ok({ body: await patientsService.setOngoing(patient, user, body) });
    }
    // /patients/{ticket}/status/waiting_kit
    if (resource.endsWith('status/waiting_kit')) {
      return responseBuilder.success
        .ok({ body: await patientsService.setWaitingKit(patient, user, body) });
    }
    // /patients/{ticket}/status/received_kit
    if (resource.endsWith('status/received_kit')) {
      return responseBuilder.success
        .ok({ body: await patientsService.setReceivedKit(patient, user, body) });
    }
    // /patients/{ticket}/status/sent_kit
    if (resource.endsWith('status/sent_kit')) {
      return responseBuilder.success
        .ok({ body: await patientsService.setSentKit(patient, user, body) });
    }
    // /patients/{ticket}/status/finished
    if (resource.endsWith('status/finished')) {
      return responseBuilder.success
        .ok({ body: await patientsService.setFinished(patient, user, body) });
    }
    // /patients/{ticket}/status/gave_up
    if (resource.endsWith('status/gave_up')) {
      return responseBuilder.success
        .ok({ body: await patientsService.setGaveUp(patient, user, body) });
    }
    // /patients/{ticket}/feedback
    if (resource.endsWith('feedback')) {
      return responseBuilder.success
        .ok({ body: await patientsService.setPatientFeedback(patient, user, body) });
    }
    // /patients/{ticket}/messaging/token
    if (resource.endsWith('messaging/token')) {
      await patientsService.setPatientMessagingToken(patient, user, body);
      return responseBuilder.success.noContent();
    }
    // /patients/{ticket}
    if (body) {
      return responseBuilder.success.ok({
        body: await updatePatient(patient, user, {
          ...body,
          status: undefined,
          lastStatus: undefined,
          [`${PATIENT_STATUSES.WAITING}Status`]: undefined,
          [`${PATIENT_STATUSES.ONGOING}Status`]: undefined,
          [`${PATIENT_STATUSES.FINISHED}Status`]: undefined,
          [`${PATIENT_STATUSES.WAITING_KIT}Status`]: undefined,
          [`${PATIENT_STATUSES.CANT_BE_ASSISTED}Status`]: undefined,
          [`${PATIENT_STATUSES.FACILITY_NOT_AVAILABLE}Status`]: undefined,
          [`${PATIENT_STATUSES.GAVE_UP}Status`]: undefined,
        }),
      });
    }

    return responseBuilder.errors.badRequest();
  } catch (err) {
    return responseBuilder.genericError(err);
  }
};

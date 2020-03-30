const { patientsService } = require('barracoes-covid-19/services');
const { getRequestContext, responseBuilder } = require('../../helpers');

const setOngoing = async (patient, user, { message }) => {
  if (!message) {
    return responseBuilder.errors.badRequest('O médico deve deixar uma mensagem para o paciente ao trocar o status para "Em atendimento"');
  }
  const updatedPatient = {
    ...patient,
    status: 'ongoing',
    ongoingDoctorDoctorName: user.name,
    ongoingDoctorUsername: user.username,
    ongoingDoctorFeedback: message || undefined,
  };
  return responseBuilder.success.ok({
    body: await patientsService.update(patient.ticket, updatedPatient),
  });
};

const setWaitingKit = async (patient, user, { message }) => {
  if (!message) {
    return responseBuilder.errors.badRequest('O médico deve deixar uma mensagem para o paciente ao trocar o status para "Aguardando kit"');
  }
  const updatedPatient = {
    ...patient,
    status: 'waiting_kit',
    waitingKitDoctorDoctorName: user.name,
    waitingKitDoctorUsername: user.username,
    waitingKitDoctorFeedback: message || undefined,
  };
  return responseBuilder.success.ok({
    body: await patientsService.update(patient.ticket, updatedPatient),
  });
};

const setFinished = async (patient, user, { message }) => {
  const updatedPatient = {
    ...patient,
    status: 'finished',
    finishedDoctorDoctorName: user.name,
    finishedDoctorUsername: user.username,
    finishedDoctorFeedback: message || undefined,
  };
  return responseBuilder.success.ok({
    body: await patientsService.update(patient.ticket, updatedPatient),
  });
};

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
  const requestContext = await getRequestContext(event);
  const {
    consumer: user,
    pathParameters = {},
    body = {},
    resource,
  } = requestContext;
  const { ticket } = pathParameters;

  try {
    const patient = await patientsService.getOneByTicket(ticket);
    if (!patient) {
      return responseBuilder.errors.notFound('Paciente não encontrado');
    }
    if (!user.master && (user.cep !== patient.cep)) {
      return responseBuilder.errors.forbidden('Você só pode alterar dados da sua região');
    }

    // /patients/{ticket}/status/ongoing
    if (resource.endsWith('status/ongoing')) return setOngoing(patient, user, body);
    // /patients/{ticket}/status/waiting_kit
    if (resource.endsWith('status/waiting_kit')) return setWaitingKit(patient, user, body);
    // /patients/{ticket}/status/finished
    if (resource.endsWith('status/finished')) return setFinished(patient, user, body);
    // /patients/{ticket}
    if (body) return updatePatient(patient, user, body);

    return responseBuilder.errors.badRequest();
  } catch (err) {
    return responseBuilder.genericError(err);
  }
};

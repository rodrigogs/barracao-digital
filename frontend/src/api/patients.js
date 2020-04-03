const encodePatient = ({
  ticket = null,
  name = '',
  age = '',
  cep = '',
  meds = null,
  allergies = null,
  covenant = null,
  hasBeenAssisted = false,
  phone = '',
  email = null,
  whatsapp = null,
  telegram = null,
  hangout = null,
  skype = null,
  status = null,
  ongoingDoctorDoctorName,
  ongoingDoctorUsername,
  ongoingDoctorFeedback,
  waitingKitDoctorDoctorName,
  waitingKitDoctorUsername,
  waitingKitDoctorFeedback,
  finishedDoctorDoctorName,
  finishedDoctorUsername,
  finishedDoctorFeedback,
} = {}) => ({
  ticket,
  name,
  age,
  cep: String(cep).match(/\d+/g).join(''),
  meds: meds || null,
  allergies: allergies || null,
  covenant: covenant || null,
  hasBeenAssisted,
  phone,
  email: email || null,
  whatsapp: whatsapp || null,
  telegram: telegram || null,
  hangout: hangout || null,
  skype: skype || null,
  status: status || null,
  ongoingDoctorDoctorName,
  ongoingDoctorUsername,
  ongoingDoctorFeedback,
  waitingKitDoctorDoctorName,
  waitingKitDoctorUsername,
  waitingKitDoctorFeedback,
  finishedDoctorDoctorName,
  finishedDoctorUsername,
  finishedDoctorFeedback,
});

export default (request) => ({
  async signUpPatient(patient) {
    const { data } = await request.post('/patients', encodePatient(patient));
    return data;
  },
  async savePatientFeedback(ticket, feedback) {
    const { data } = await request.put(`/patients/${ticket}/feedback`, { value: feedback });
    return data;
  },
  async getPatientByTicket(ticket) {
    const { data } = await request.get(`/patients/ticket/${ticket}`);
    return data;
  },
  async getList({ cep, params }) {
    const { data } = await request.get(`/patients/cep/${cep}`, { params });
    return data;
  },
  async update({ ticket, patient }) {
    await request.put(`/patients/${ticket}`, patient);
  },
  async setOngoing({ ticket, message }) {
    const { data } = await request.put(`/patients/${ticket}/status/ongoing`, { message });
    return data;
  },
  async setWaitingKit({ ticket, message }) {
    const { data } = await request.put(`/patients/${ticket}/status/waiting_kit`, { message });
    return data;
  },
  async setFinished({ ticket, message }) {
    const { data } = await request.put(`/patients/${ticket}/status/finished`, { message });
    return data;
  },
  async setMessagingToken({ ticket, token }) {
    const { data } = await request.put(`/patients/${ticket}/messaging/token`, { ticket, token });
    return data;
  },
});

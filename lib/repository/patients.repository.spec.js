const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });

const patientsRepository = require('./patients.repository');

let patient;

describe('#create', () => {
  it('Create a new patient', async () => {
    const patientPayload = {
      name: 'name',
      age: 30,
      meds: 'Some meds',
      allergies: 'Some allergies',
      covenant: 'I\'m poor!',
      cep: '123456',
      contact: '54534345435',
      contactType: 'phone',
    };

    const saved = await patientsRepository.create(patientPayload);

    patient = await patientsRepository.getOneById(saved.id);

    expect(patient).toHaveProperty('id', saved.id);
    expect(patient).toHaveProperty('name', patientPayload.name);
    expect(patient).toHaveProperty('age', patientPayload.age);
    expect(patient).toHaveProperty('meds', patientPayload.meds);
    expect(patient).toHaveProperty('allergies', patientPayload.allergies);
    expect(patient).toHaveProperty('covenant', patientPayload.covenant);
    expect(patient).toHaveProperty('cep', patientPayload.cep);
    expect(patient).toHaveProperty('contact', patientPayload.contact);
    expect(patient).toHaveProperty('contactType', patientPayload.contactType);
    expect(patient.createdAt).toBeGreaterThan(0);
    expect(patient.updatedAt).toBeGreaterThanOrEqual(patient.createdAt);
  });
});

describe('#update', () => {
  it('Update the created patient', async () => {
    const updated = await patientsRepository.update({ ...patient, status: 'ongoing' });

    patient = await patientsRepository.getOneById(updated.id);

    expect(patient).toHaveProperty('id', updated.id);
    expect(patient).toHaveProperty('name', updated.name);
    expect(patient).toHaveProperty('age', updated.age);
    expect(patient).toHaveProperty('meds', updated.meds);
    expect(patient).toHaveProperty('allergies', updated.allergies);
    expect(patient).toHaveProperty('covenant', updated.covenant);
    expect(patient).toHaveProperty('cep', updated.cep);
    expect(patient).toHaveProperty('contact', updated.contact);
    expect(patient).toHaveProperty('contactType', updated.contactType);
    expect(patient).toHaveProperty('createdAt', updated.createdAt);
    expect(patient).toHaveProperty('updatedAt', updated.updatedAt);
  });
});

describe('#getAllByCep', () => {
  it('Get patients by CEP', async () => {
    const patients = await patientsRepository.getAllByCep(patient.cep);

    expect(patients.length).toBeGreaterThan(0);
    expect(patients).toEqual(
      expect.arrayContaining([patient]),
    );
  });
});

describe('#getAllByCepAndStatus', () => {
  it('Get patients by CEP and Status', async () => {
    const patients = await patientsRepository.getAllByCepAndStatus(patient.cep, 'waiting');

    expect(patients.length).toBeGreaterThan(0);
    expect(patients).toEqual(
      expect.not.arrayContaining([patient]),
    );
  });
});

describe('#getOneById', () => {
  it('Get one patient by id', async () => {
    const old = { ...patient };

    patient = await patientsRepository.getOneById(old.id);

    expect(patient).toHaveProperty('id', old.id);
    expect(patient).toHaveProperty('name', old.name);
    expect(patient).toHaveProperty('age', old.age);
    expect(patient).toHaveProperty('meds', old.meds);
    expect(patient).toHaveProperty('allergies', old.allergies);
    expect(patient).toHaveProperty('covenant', old.covenant);
    expect(patient).toHaveProperty('cep', old.cep);
    expect(patient).toHaveProperty('contact', old.contact);
    expect(patient).toHaveProperty('contactType', old.contactType);
    expect(patient).toHaveProperty('createdAt', old.createdAt);
    expect(patient).toHaveProperty('updatedAt', old.updatedAt);
  });
});

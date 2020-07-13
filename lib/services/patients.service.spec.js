const AWS = require('aws-sdk');
const promisePool = require('@rodrigogs/promise-pool');

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const patientsService = require('./patients.service');

describe('#optimisticLocking', () => {
  it('Create a new patient', async () => {
    const patientPayload = {
      name: 'name',
      age: 30,
      meds: 'Some meds',
      allergies: 'Some allergies',
      covenant: 'I\'m poor!',
      cep: '123456',
      phone: '54534345435',
      telegram: 'phone',
    };

    function* generator(times) {
      for (let i = 0; i < times; i += 1) {
        yield i;
      }
    }

    const processor = async () => {
      console.log(process.env.AWS_DEFAULT_REGION);
      await patientsService.create(patientPayload);
    };

    await promisePool({
      generator: generator(1000),
      processor,
      concurrency: 1,
    });
  });
});

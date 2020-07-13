#!/usr/bin/env node

const promisePool = require('@rodrigogs/promise-pool');
const barracaoDigital = require('../lib');

async function* doctorsGenerator() {
  let items = [];
  let lastEvaluatedKey = null;
  do {
    ({ items, lastEvaluatedKey } = await barracaoDigital
      .services
      .doctorsService
      .getAll({ lastEvaluatedKey, pageSize: 1000 }));
    yield* items;
  } while (lastEvaluatedKey)
}

const processor = async (doctor) => {
  try {
    console.log('Updating doctor', doctor.username);
    delete doctor.password
    await barracaoDigital
      .services
      .doctorsService
      .update(doctor.username, doctor);
  } catch (err) {
    console.error('Update failed for doctor', doctor.username, 'with error', err);
  }
}

/**
 * Update all doctors
 */
(async () => {
  try {
    await promisePool({
      generator: doctorsGenerator(),
      processor,
      concurrency: 10
    });
  } catch (err) {
    console.error(err)
    process.exit(1);
  }
  process.exit(0);
})();

/* eslint-disable import/no-commonjs, import/no-commonjs,no-process-env */
const merge = require('lodash.merge')
const common = require('../../serverless.common')

module.exports = merge(common, {
  service: 'bd-tools-dl-cpf-fixer',
  plugins: ['serverless-bundle'],
  package: { individually: true },
  custom: {
    patientsTableName: 'barracao-digital-${self:provider.stage}-patients-table'
  },
  provider: {
    runtime: 'nodejs12.x',
    memorySize: 1024,
    timeout: 120,
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['logs:*'],
        Resource: '*',
      },
      {
        Effect: 'Allow',
        Action: ['athena:*'],
        Resource: '*',
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: '*',
      },
      {
        Effect: 'Allow',
        Action: ['dynamodb:*'],
        Resource: '*',
      },
    ],
    environment: {
      PATIENTS_TABLE_NAME: '${self:custom.patientsTableName}'
    },
  },
  functions: {
    datalakeCpfFixer: {
      handler: 'index.handler',
    },
  },
  resources: {
  },
})

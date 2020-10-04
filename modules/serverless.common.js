/* eslint-disable import/no-commonjs */
const path = require('path')
const dotenv = require('dotenv')
const { name: rootPackageName } = require('../package.json')

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

module.exports = {
  org: 'rodrigogs',
  app: rootPackageName,
  custom: {
    stage: "${opt:stage, env:STAGE, 'development'}",
    region: "${opt:region, env:AWS_DEFAULT_REGION, 'us-east-1'}",
  },
  provider: {
    name: 'aws',
    profile: 'barracao-digital',
    stage: '${self:custom.stage}',
    region: '${self:custom.region}',
    deploymentBucket: {
      name: '${self:app}-deploys',
      maxPreviousDeploymentArtifacts: 10,
      blockPublicAccess: true,
    },
    environment: {
      APP_NAME: '${self:app}',
      SERVICE_NAME: '${self:service}',
      STAGE: '${self:custom.stage}',
      REGION: '${self:custom.region}',
    },
  },
}

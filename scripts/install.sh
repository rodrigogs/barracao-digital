#!/bin/bash

# Global
processors=$(ps aux --no-heading | wc -l)
npm install -g concurrently

concurrently\
  --max-processes "$processors"\
  --kill-others-on-fail\
  "npm install yarn -g"\
  "npm install serverless -g"

# Tasks
concurrently\
  --max-processes "$processors"\
  --kill-others-on-fail\
  "(npm install --production=false)"\
  "(cd cep-crawler || exit && npm install --production=false)"\
  "(cd lib || exit && npm install --production=false)"\
  "(cd functions || exit && npm install --production=false)"\
  "(cd frontend || exit && yarn install --production=false)"

#!/bin/bash

# Global
processors=$(ps aux --no-heading | wc -l)
#sudo apt install -y libgtk-3-0 libxss1 libgconf-2-4 libasound2 libnss3
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
  "(cd frontend || exit && yarn install --production=false)"\
  "(cd layers/common/nodejs || exit && npm install --production=false)"

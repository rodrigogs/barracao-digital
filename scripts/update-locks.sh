#!/bin/bash
set -e

# Global
script_dir=$(dirname "$0")
"./${script_dir}/install_globals.sh"
processors=$(ps aux --no-heading | wc -l)

# Tasks
concurrently\
  --max-processes "$processors"\
  --kill-others-on-fail\
  "(npm install --production=false --save)"\
  "(cd cep-crawler || exit && npm install --production=false --save)"\
  "(cd lib || exit && npm install --production=false --save)"\
  "(cd functions || exit && npm install --production=false --save)"\
  "(cd frontend || exit && yarn install --production=false --save)"\
  "(cd layers/common/nodejs || exit && npm install --production=false --save)"

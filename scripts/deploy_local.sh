#!/bin/bash


# Global
script_dir=$(dirname "$0")
processors=$(ps aux --no-heading | wc -l)
npm install -g concurrently

if [ -z $NODE_ENV ]; then
  echo -e "${BOLD}${RED}Missing environment variable NODE_ENV${RESET}"
  exit 1
fi

concurrently\
  --max-processes "$processors"\
  --kill-others-on-fail\
  "$script_dir/deploy_local_backend.sh"\
  "$script_dir/deploy_local_frontend.sh"\

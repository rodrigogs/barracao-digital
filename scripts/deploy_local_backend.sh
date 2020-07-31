#!/bin/bash
set -e

# Global
script_dir=$(dirname "$0")
"./${script_dir}/install_globals.sh"
processors=$(ps aux --no-heading | wc -l)

if [ -z $NODE_ENV ]; then
  echo -e "${BOLD}${RED}Missing environment variable NODE_ENV${RESET}"
  exit 1
fi

concurrently\
  --max-processes "$processors"\
  --kill-others-on-fail\
  "$script_dir/deploy_backend.sh"\
  "$script_dir/deploy_processors.sh"\

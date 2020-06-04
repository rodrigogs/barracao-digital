#!/bin/bash

## Text Tools
RESET="\e[0m"
BOLD="\e[1m"
YELLOW="\e[33m"
RED="\e[91m"
GREEN="\e[32m"

if [ -z "$NODE_ENV" ]; then
  echo -e "${BOLD}${RED}Missing environment variable NODE_ENV${RESET}"
  exit 1
fi

echo -e "${BOLD}${YELLOW}Deploying processors backend...${RESET}"
(cd functions/processors && sls deploy)
echo -e "${BOLD}${GREEN}Done deploying processors backend!${RESET}"

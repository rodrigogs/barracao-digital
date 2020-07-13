#!/bin/bash
set -e

## Text Tools
RESET="\e[0m"
BOLD="\e[1m"
YELLOW="\e[33m"
GREEN="\e[32m"

echo -e "${BOLD}${YELLOW}Installing backend dependencies...${RESET}"
npm run install:backend
echo -e "${BOLD}${YELLOW}Deploying backend...${RESET}"
npm run deploy:backend

echo -e "${BOLD}${GREEN}Done!${RESET}"

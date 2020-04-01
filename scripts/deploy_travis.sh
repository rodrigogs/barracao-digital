#!/bin/bash

## Text Tools
RESET="\e[0m"
BOLD="\e[1m"
YELLOW="\e[33m"
RED="\e[91m"
GREEN="\e[32m"

echo "Travis ENVS:"
echo "TARGET=${TARGET}"
echo "TRAVIS_BRANCH=${TRAVIS_BRANCH}"
echo "TRAVIS_PULL_REQUEST=${TRAVIS_PULL_REQUEST}"
echo "TRAVIS_EVENT_TYPE=${TRAVIS_EVENT_TYPE}"
echo "TRAVIS_COMMIT=${TRAVIS_COMMIT}"
echo "TRAVIS_COMMIT_RANGE=${TRAVIS_COMMIT_RANGE}"

if [ -z $NODE_ENV ]; then
    echo -e "${BOLD}${RED}Missing environment variable NODE_ENV${RESET}"
    exit 1
fi

if [[ $DEPLOY_FRONTEND == "true" ]]; then
    echo -e "${BOLD}${YELLOW}Installing frontend dependencies...${RESET}"
    npm run install:frontend
    echo -e "${BOLD}${YELLOW}Building frontend...${RESET}"
    npm run build:frontend
    echo -e "${BOLD}${YELLOW}Deploying frontend...${RESET}"
    npm run deploy:frontend
fi

if [[ $DEPLOY_BACKEND == "true" ]]; then
    echo -e "${BOLD}${YELLOW}Installing backend dependencies...${RESET}"
    npm run install:backend
    echo -e "${BOLD}${YELLOW}Building backend...${RESET}"
    npm run build:backend
    echo -e "${BOLD}${YELLOW}Deploying backend...${RESET}"
    npm run deploy:backend
fi

echo -e "${BOLD}${GREEN}Done!${RESET}"

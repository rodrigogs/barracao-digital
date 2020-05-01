#!/bin/bash

# Global
npm install yarn -g
npm install serverless -g

(
  # Root
  npm install --production=false
) &
(
  # cep-crawler
  cd cep-crawler || exit
  npm install --production=false
) &
(
  # Lib
  cd lib || exit
  npm install --production=false
) &
(
  # Functions
  cd functions || exit
  npm install --production=false
) &
(
  # Frontend
  cd frontend || exit
  yarn install --production=false
)

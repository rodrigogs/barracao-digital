#!/bin/bash
set -e

# Global
npm install yarn -g
npm install serverless -g

(
  # Root
  npm install --production=false --save
) &
(
 # Layers
 cd layers/common/nodejs || exit
 npm install --production=false --save
) &
(
  # cep-crawler
  cd cep-crawler || exit
  npm install --production=false --save
) &
(
  # Lib
  cd lib || exit
  npm install --production=false --save
) &
(
  # Functions
  cd functions || exit
  npm install --production=false --save
) &
(
  # Frontend
  cd frontend || exit
  yarn install --production=false --update-checksums
)

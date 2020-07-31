#!/bin/bash
set -e

if ! [ -x "$(command -v concurrently)" ]; then
  echo 'Installing concurrently globally...'
  npm install -g concurrently
fi

if ! [ -x "$(command -v serverless)" ]; then
  echo 'Installing serverless globally...'
  npm install -g serverless
fi

if ! [ -x "$(command -v yarn)" ]; then
  echo 'Installing yarn globally...'
  npm install -g yarn
fi

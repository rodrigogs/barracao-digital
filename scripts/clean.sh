#!/bin/bash

(
  # Root
  rm -rf node_modules
  rm -rf package-lock.json
  rm -rf .serverless
  rm -rf dist
) &
(
  #cep-crawler
  cd cep-crawler || exit
  rm -rf node_modules
  rm -rf package-lock.json
) &
(
  # Lib
  cd lib || exit
  rm -rf node_modules
  rm -rf package-lock.json
  (
    cd providers/aws || exit
    rm -rf node_modules
    rm -rf package-lock.json
  ) &
  (
    cd providers/firebase || exit
    rm -rf node_modules
    rm -rf package-lock.json
  ) &
  (
    cd providers/gmaps || exit
    rm -rf node_modules
    rm -rf package-lock.json
  ) &
  (
    cd providers/opentok || exit
    rm -rf node_modules
    rm -rf package-lock.json
  )
) &
(
  # Functions
  cd functions || exit
  rm -rf node_modules
  rm -rf package-lock.json
) &
(
  # Frontend
  cd frontend || exit
  rm -rf node_modules
  rm -rf package-lock.json
  rm -rf yarn.lock
  rm -rf dist
  rm -rf .nuxt
)

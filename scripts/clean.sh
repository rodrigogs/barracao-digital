#!/bin/bash

(
    # Root
    rm -rf node_modules
    rm -rf package-lock.json
    rm -rf .serverless
    rm -rf dist
) & (
    # Lib
    cd lib
    rm -rf node_modules
    rm -rf package-lock.json
) & (
    # Functions
    cd functions
    rm -rf node_modules
    rm -rf package-lock.json
) & (
    # Frontend
    cd frontend
    rm -rf node_modules
    rm -rf package-lock.json
    rm -rf dist
)

#!/bin/bash

# Global
npm install yarn -g
npm install serverless -g

(
    # Root
    npm install --production=false --save
) & (
    # Lib
    cd lib
    npm install --production=false --save
) & (
    # Functions
    cd functions
    npm install --production=false --save
) & (
    # Frontend
    cd frontend
    yarn install --production=false --update-checksums
)

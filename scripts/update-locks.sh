#!/bin/bash

# Global
npm install yarn -g
npm install serverless -g

(
    # Root
    npm install --save
) & (
    # Lib
    cd lib
    npm install --save
) & (
    # Functions
    cd functions
    npm install --save
) & (
    # Frontend
    cd frontend
    yarn install --update-checksums
)

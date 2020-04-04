#!/bin/bash

(
    # Root
    npm install --save
) & (
    # Lib
    cd frontend
    npm install --save
) & (
    # Functions
    cd functions
    npm install --save
) & (
    # Frontend
    cd frontend
    npm install
)

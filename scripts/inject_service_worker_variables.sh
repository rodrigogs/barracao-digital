#!/bin/bash

sed -i "s/_FIREBASE_CONFIG_/${VUE_APP_FIREBASE_CONFIG}/g" './frontend/dist/firebase-messaging-sw.js'

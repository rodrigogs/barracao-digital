#!/bin/bash
set -e

# Global
script_dir=$(dirname "$0")
processors=$(ps aux --no-heading | wc -l)
npm install -g concurrently

concurrently\
  --max-processes "$processors"\
  --kill-others-on-fail\
  "cd $script_dir/.. && rm -rf node_modules"\
  "cd $script_dir/.. && rm -rf package-lock.json"\
  "cd $script_dir/.. && rm -rf .serverless"\
  "cd $script_dir/.. && rm -rf dist"\
  "cd $script_dir/../cep-crawler && rm -rf node_modules"\
  "cd $script_dir/../cep-crawler && rm -rf package-lock.json"\
  "cd $script_dir/../lib && rm -rf node_modules"\
  "cd $script_dir/../lib && rm -rf package-lock.json"\
  "cd $script_dir/../lib && rm -rf package-lock.json"\
  "cd $script_dir/../lib/providers/aws && rm -rf node_modules"\
  "cd $script_dir/../lib/providers/aws && rm -rf package-lock.json"\
  "cd $script_dir/../lib/providers/aws && rm -rf package-lock.json"\
  "cd $script_dir/../lib/providers/firebase && rm -rf node_modules"\
  "cd $script_dir/../lib/providers/firebase && rm -rf package-lock.json"\
  "cd $script_dir/../lib/providers/gmaps && rm -rf node_modules"\
  "cd $script_dir/../lib/providers/gmaps && rm -rf package-lock.json"\
  "cd $script_dir/../lib/providers/opentok && rm -rf node_modules"\
  "cd $script_dir/../lib/providers/opentok && rm -rf package-lock.json"\
  "cd $script_dir/../lib/providers/telegram && rm -rf node_modules"\
  "cd $script_dir/../lib/providers/telegram && rm -rf package-lock.json"\
  "cd $script_dir/../lib/providers/sms && rm -rf node_modules"\
  "cd $script_dir/../lib/providers/sms && rm -rf package-lock.json"\
  "cd $script_dir/../functions && rm -rf node_modules"\
  "cd $script_dir/../functions && rm -rf package-lock.json"\
  "cd $script_dir/../functions/processors && rm -rf node_modules"\
  "cd $script_dir/../functions/processors && rm -rf package-lock.json"\
  "cd $script_dir/../functions/processors && rm -rf .serverless"\
  "cd $script_dir/../frontend && rm -rf node_modules"\
  "cd $script_dir/../frontend && rm -rf package-lock.json"\
  "cd $script_dir/../frontend && rm -rf yarn.lock"\
  "cd $script_dir/../frontend && rm -rf dist"\
  "cd $script_dir/../frontend && rm -rf .nuxt"\
  "cd $script_dir/../layers/common/nodejs && rm -rf node_modules"\
  "cd $script_dir/../layers/common/nodejs && rm -rf package-lock-json"

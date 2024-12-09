#!/bin/bash
nvm use
yarn install
export NODE_OPTIONS=--openssl-legacy-provider 
yarn build
tar -cvzf dist.tgz webapp/dist
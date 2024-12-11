#!/bin/bash
nvm use
yarn install
export NODE_OPTIONS=--openssl-legacy-provider 
yarn build
tar -cvzf dist.tgz packages/webapp/dist
mv dist.tgz /your/path/to/wise-ui/folder
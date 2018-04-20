#!/bin/bash

git reset --hard
git pull
export NODE_ENV=production
npm run install-all
cd server
npm run migrate
cd ../client
au build --env prod
cd ..

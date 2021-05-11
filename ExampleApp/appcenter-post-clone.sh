#!/usr/bin/env bash
cd ..
ls
npm i json --dev
npm run pack
cd ExampleApp
printf "APP_ID=$APP_ID\nRESOLVE_API=$RESOLVE_API\nCHANNEL_ID=$CHANNEL_ID" > .env
cat .env
npm i ../qiscus-community-react-native-multichannel-widget-*

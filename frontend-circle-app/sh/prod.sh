#!/usr/bin/env bash

echo "Copying prod apis files."
echo "export default 'prod';" >active.env.js
cp ./firebase/prod/google-services.json ./android/app/
cp ./firebase/prod/GoogleService-Info.plist ./ios/

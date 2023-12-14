#!/usr/bin/env bash

# rm -rf ios/CirclesCityS*
# rm -rf android/app/src/main/java/city/circles/app/staging

echo "Copying dev apis files."
echo "export default 'dev';" >active.env.js
cp ./firebase/debug/google-services.json ./android/app/
cp ./firebase/debug/GoogleService-Info.plist ./ios/
# cp ./firebase/dev/strings.xml ./android/app/src/main/res/values/strings.xml
# sed -i '' 's/693586964818905/839830189753981/g' ./ios/CirclesCity/Info.plist

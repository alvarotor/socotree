#!/usr/bin/env bash

# echo "Setting staging parameters =>"

# paramName=$1
# paramId=$2

# if [ -z "$1" ]; then
#     paramName="Circles City Staging"
# fi

# if [ -z "$2" ]; then
#     paramId="city.circles.app.staging"
# fi

# echo "Setting react-native-rename to staging =>"
# npx react-native-rename@2.4.1 "TESTING" -b testing.more.testing
# npx react-native-rename@2.4.1 "$paramName" -b $paramId
# rm -rf ./android/app/src/main/java/testing
# oldid="city.circles.app.dev;"
# id="PRODUCT_BUNDLE_IDENTIFIER = ${oldid}"
# newnamenospaces="${paramName//[[:blank:]]/}"
# name="PRODUCT_NAME = ${newnamenospaces}"
# newname="PRODUCT_NAME = \"${paramName}\""
# newid="PRODUCT_BUNDLE_IDENTIFIER = ${paramId};"
# echo "Setting project.pbxproj files to staging =>"
# sed -i '' "s/${name}/${newname}/g" ./ios/${newnamenospaces}.xcodeproj/project.pbxproj
# sed -i '' "s/${id}/${newid}/g" ./ios/${newnamenospaces}.xcodeproj/project.pbxproj
# sed -i '' "s/${oldid}/${paramId};/g" ./android/app/src/main/java/city/circles/app/staging/SplashActivity.java
# watchman watch-del-all
# cd android
# ./gradlew clean
# rm -rf .gradle
# rm -rf .idea
# cd ..
# cd ios
# xcodebuild clean
# pod install
# cd ..

echo "Copying staging apis files."
echo "export default 'staging';" >active.env.js
cp ./firebase/staging/google-services.json ./android/app/
cp ./firebase/staging/GoogleService-Info.plist ./ios/
# cp ./firebase/staging/strings.xml ./android/app/src/main/res/values/strings.xml
# sed -i '' 's/693586964818905/839830189753981/g' ./ios/CirclesCity/Info.plist

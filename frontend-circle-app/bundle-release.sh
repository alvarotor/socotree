clear
echo --- Set Stagging Env
yarn set-staging
echo --- React Native Bundling Release
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/build/intermediates/res/merged/release/ 
rm -rf android/app/src/main/res/drawable-* 
rm -rf android/app/src/main/res/raw/*
echo --- Assemble Apk
cd android && ./gradlew clean && ./gradlew assembleRelease && cd ..  
cd android/app/build/outputs/apk/release  
echo --- Zipping Apk
zip app-release.zip app-release-unsigned.apk
rm output.json  
echo --- Moving Apk to Dropbox
cp app-release.zip ~/Dropbox  
rm app-release.*
cd /Users/alvaro/projects/socotree/frontend-circle-app
echo --- Bundling Release finished

clear
echo --- Set Stagging Env
yarn set-staging
echo --- React Native Bundling
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
echo --- Assemble Apk
cd android && ./gradlew clean && ./gradlew assembleDebug && cd ..  
cd android/app/build/outputs/apk/debug/   
echo --- Zipping Apk
zip app-debug.zip app-debug.apk 
rm output.json  
echo --- Moving Apk to Dropbox
cp app-debug.zip ~/Dropbox  
rm app-debug.*
cd /Users/alvaro/projects/socotree/frontend-circle-app
echo --- Bundling finished

npx react-native run-android 
cd android  
./gradlew bundleRelease 
cd app/build/outputs/bundle/release/   
bundletool build-apks --bundle=./app.aab --output=~/Dropbox/app.apks --mode=universal
cd ~/Dropbox  
unzip app.apks    
mv universal.apk universal4.apk
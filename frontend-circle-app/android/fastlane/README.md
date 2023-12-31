fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## Android
### android test
```
fastlane android test
```
Runs all the tests
### android tests
```
fastlane android tests
```
Runs all the tests
### android build
```
fastlane android build
```
Build
### android beta
```
fastlane android beta
```
Submit a new Beta Build to Play Store
### android build_for_screengrab
```
fastlane android build_for_screengrab
```
Build debug and test APK for screenshots
### android deploy
```
fastlane android deploy
```
Deploy a new version to the Google Play
### android release
```
fastlane android release
```
Release

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

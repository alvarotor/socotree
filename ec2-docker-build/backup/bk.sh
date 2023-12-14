rm -rf ./files
mkdir files

rsync -arv --exclude=.git ../../backend-messages-circle-app ./files
zip -r ./files/backend-messages-circle-app.zip ./files/backend-messages-circle-app/

rsync -arv --exclude=.git ../../backend-circle-app ./files
zip -r ./files/backend-circle-app.zip ./files/backend-circle-app/

rsync -arv --exclude=.git ../../backend-ticker-circles-app ./files
zip -r ./files/backend-ticker-circles-app.zip ./files/backend-ticker-circles-app/

rsync -arv --exclude=.git ../../backend-notifications-circles-app ./files
zip -r ./files/backend-notifications-circles-app.zip ./files/backend-notifications-circles-app/

rsync -arv --exclude=.git --exclude=node_modules ../../../../../../projects/socotree/TwilioTokenVideo ./files
zip -r ./files/TwilioTokenVideo.zip ./files/TwilioTokenVideo/

rsync -arv --exclude=.git --exclude=./backup.files --exclude=backend.zip --exclude=backend --exclude=postgres_circles-202* ../. ./files/ec2-docker-build
zip -r ./files/ec2-docker-build.zip ./files/ec2-docker-build/

rsync -arv --exclude=.git --exclude=node_modules --exclude=android/.gradle ../../../../../../projects/socotree/JitsiReactNative ./files
zip -r ./files/JitsiReactNative.zip ./files/JitsiReactNative/

rsync -arv --exclude=.git --exclude=node_modules --exclude=build ../../../../../../projects/socotree/frontend-admin-circle-app ./files
zip -r ./files/frontend-admin-circle-app.zip ./files/frontend-admin-circle-app/

rsync -arv --exclude=.git --exclude=node_modules --exclude=android/app/build --exclude=android/build --exclude=ios/Pods --exclude=android/.gradle ../../../../../../projects/socotree/frontend-circle-app ./files
zip -r ./files/frontend-circle-app.zip ./files/frontend-circle-app/

rsync -arv --exclude=.git --exclude=__pycache__ ../../../../../../projects/socotree/matching-algorithm ./files
zip -r ./files/matching-algorithm.zip ./files/matching-algorithm/

rsync -arv ~/Documents ./files
zip -r ./files/Documents.zip ./files/Documents/

mv ./files/*.zip ../../../../../../Dropbox/backup

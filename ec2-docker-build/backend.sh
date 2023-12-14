rm -rf ./backend
rm ./backend.zip

cd ../backend-circle-app
env GOOS=linux GOARCH=386 go build -o ../ec2-docker-build/backend/build/backend main.go sql.go
cd ../backend-messages-circle-app
env GOOS=linux GOARCH=386 go build -o ../ec2-docker-build/backend/build/backend-messages main.go
cd ../backend-notifications-circles-app
env GOOS=linux GOARCH=386 go build -o ../ec2-docker-build/backend/build/backend-notifications main.go
cp -r mail_templates ../ec2-docker-build/backend/build
cd ../ec2-docker-build

cp Dockerfile* ./backend
cp docker-compose-backend-ma.yml ./backend/docker-compose.yml
cp .env.local ./backend/.env
mkdir ./backend/nginx
cp nginx/index.html ./backend/nginx/
cp nginx/nginx.conf.ma ./backend/nginx/nginx.conf

mkdir ./backend/app-admin
cd ~/projects/socotree/frontend-admin-circle-app
yarn build
cd build
cp -r . ~/go_projects/src/github.com/socotree/ec2-docker-build/backend/app-admin
cd ~/go_projects/src/github.com/socotree/ec2-docker-build

zip -r backend.zip backend
open .

clear
SERVER=ec2-user@api.circles.berlin
scp -i ../backend-t3alarge.pem ./.envPROD $SERVER:~/.env
scp -i ../backend-t3alarge.pem ./docker-compose.yml $SERVER:~/docker-compose.yml
# scp -i ../backend-t3alarge.pem ../DockerfileGetTokenTwilio $SERVER:~/DockerfileGetTokenTwilio
# scp -i ../backend-t3alarge.pem ../DockerfileBackendMatchingAlgo $SERVER:~/DockerfileBackendMatchingAlgo
# scp -i ../backend-t3alarge.pem ../DockerfileBackendNotifications $SERVER:~/DockerfileBackendNotifications
# scp -i ../backend-t3alarge.pem ../DockerfileBackendMessages $SERVER:~/DockerfileBackendMessages
# scp -i ../backend-t3alarge.pem ../DockerfileBackend $SERVER:~/DockerfileBackend
scp -i ../backend-t3alarge.pem ../nginx/nginx.conf.prod $SERVER:~/nginx.conf
scp -i ../backend-t3alarge.pem ../nginx/index.html $SERVER:~/index.html
scp -i ../backend-t3alarge.pem ./init-letsencrypt.sh $SERVER:~/init-letsencrypt.sh

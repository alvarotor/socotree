clear
SERVER=ec2-user@apidev.circles.berlin
scp -i ../backend.pem ./.envSTAG $SERVER:~/.env
scp -i ../backend.pem ./docker-compose.yml $SERVER:~/docker-compose.yml
# scp -i ../backend.pem ../DockerfileGetTokenTwilio $SERVER:~/DockerfileGetTokenTwilio
# scp -i ../backend.pem ../DockerfileBackendMatchingAlgo $SERVER:~/DockerfileBackendMatchingAlgo
# scp -i ../backend.pem ../DockerfileBackendNotifications $SERVER:~/DockerfileBackendNotifications
# scp -i ../backend.pem ../DockerfileBackendMessages $SERVER:~/DockerfileBackendMessages
# scp -i ../backend.pem ../DockerfileBackend $SERVER:~/DockerfileBackend
scp -i ../backend.pem ../nginx/nginx.conf.stag $SERVER:~/nginx.conf
scp -i ../backend.pem ../nginx/index.html $SERVER:~/index.html
scp -i ../backend.pem ./init-letsencrypt.sh $SERVER:~/init-letsencrypt.sh

#!/bin/bash
echo 'Restarting docker compose...'
# local RESULTS
RESULTS=$(ssh ec2-user@apidev.circles.berlin "
docker-compose down
docker-compose rm -f
docker-compose pull app_notifications
sudo docker-compose up -d --build
")
echo $?
echo 'Restarting docker compose completed successfully'

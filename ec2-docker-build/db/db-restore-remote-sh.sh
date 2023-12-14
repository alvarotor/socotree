#!/bin/bash

dbfile=$1
echo "Docker compose down and delete volumes"
sudo docker-compose down -v
echo "Docker compose up DB"
sudo docker-compose up -d db
echo "Wait 3 secs to give time to create DB server..."
sleep 2
echo "Docker compose DELETE DB"
sudo docker exec ec2-user_db_1 psql -U testing -d postgres -c "DROP DATABASE postgres_circles;"
echo "Docker compose CREATE DB"
sudo docker exec ec2-user_db_1 psql -U testing -d postgres -c "CREATE DATABASE postgres_circles;"
echo "Restore DB"
sudo zcat ./$dbfile | docker exec --interactive ec2-user_db_1 psql --username=testing --dbname=postgres_circles -W
sudo docker-compose up -d
rm ./$dbfile

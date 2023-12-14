scp -i backend-t3alarge.pem ec2-user@api.circles.berlin:~/pgbackups/daily/postgres_circles-20201201-000000.sql.gz .
docker-compose down --remove-orphans
docker-compose up db
docker exec -it ec2-docker-build_db_1 psql -U testing -d postgres -c "DROP DATABASE postgres_circles;"
docker exec -it ec2-docker-build_db_1 psql -U testing -d postgres -c "CREATE DATABASE postgres_circles;"
gzcat ./postgres_circles-20201217-000000.sql.gz | docker exec --interactive ec2-docker-build_db_1 psql --username=testing --dbname=postgres_circles -W

sudo docker rmi -f $(docker images -a -q)
docker system prune
docker system prune --volumes
sudo du -sh /var -----> size of a directory
df -h -----> check disk sizes

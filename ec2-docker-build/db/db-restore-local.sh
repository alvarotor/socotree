# day=$(date -v -1d +'%d')
backup_namefile=$(date +'%Y%m%d')
dbfile="postgres_circles-${backup_namefile}${day}-000000.sql.gz"
# dbfile="postgres_circles-20210215-225138.sql.gz"
cd ..
echo "Docker compose down and delete volumes"
docker-compose down -v --remove-orphans
echo "Docker compose up DB"
docker-compose up -d db
echo "Wait 3 secs to give time to create DB server..."
sleep 2
echo "Docker compose DELETE DB"
docker exec -it ec2-docker-build_db_1 psql -U testing -d postgres -c "DROP DATABASE postgres_circles;"
echo "Docker compose CREATE DB"
docker exec -it ec2-docker-build_db_1 psql -U testing -d postgres -c "CREATE DATABASE postgres_circles;"
echo "Restore DB"
gzcat ./db/dbs/$dbfile | docker exec --interactive ec2-docker-build_db_1 psql --username=testing --dbname=postgres_circles -W
docker-compose up -d
cd db

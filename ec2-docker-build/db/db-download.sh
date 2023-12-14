# day=$(date -v -1d +'%d')
backup_namefile=$(date +'%Y%m%d')
dbfile="postgres_circles-${backup_namefile}${day}-000000.sql.gz"
#dbfile="postgres_circles-20210105-150005.sql.gz"
echo "Downloading ${dbfile} backup"
scp -i ../backend-t3alarge.pem ec2-user@api.circles.berlin:~/pgbackups/daily/$dbfile ./dbs
cp ./dbs/$dbfile ../../../../../../Dropbox/backup
open ./dbs

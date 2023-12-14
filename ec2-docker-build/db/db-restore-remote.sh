#!/bin/bash

# day=$(date -v -1d +'%d')
backup_namefile=$(date +'%Y%m%d')
dbfile="postgres_circles-${backup_namefile}${day}-000000.sql.gz"
SERVER=ec2-user@apidev.circles.berlin
scp -i ../backend.pem ./dbs/$dbfile $SERVER:~/$dbfile
# ssh -i ../backend.pem $SERVER 'bash -s' < db-restore-remote-sh.sh $dbfile
ssh -i ../backend.pem $SERVER 'bash -s' $dbfile <db-restore-remote-sh.sh
# rm ./$dbfile

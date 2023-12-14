import pandas as pd
import numpy as np
import os
import sys
import uuid
import datetime
import psycopg2
from sqlalchemy import create_engine

from environ import *
 
 # open a connection
def open_conn():
    try:
        connection = psycopg2.connect(user = POSTGRES_USER,
                                      password = POSTGRES_PASSWORD,
                                      host = POSTGRES_HOST,
                                      port = POSTGRES_PORT,
                                      database = POSTGRES_DB)
        print('Connection stablished')

        return connection

    except (Exception, psycopg2.Error) as error:
        print ("Error while connecting to PostgreSQL", error, file=sys.stdout)
       
# closing a connection
def close_conn(connection):
    if (connection):
        connection.close()
        print('Connection closed')
        
# function for sending the queries
def gather_data(query, connection):
    '''
    The function sends a query and stores the gathered info as a dataframe
    
    Input:
        - query (str): The query to send
            
    Output:
        - df (pd.Dataframe): A Dataframe with the gathered info
    '''    
    # sends the query and stores the info in a dataframe
    df = pd.read_sql_query(query, connection)
        
    return df

import uuid
import psycopg2
import datetime

USERS_QUERY = "SELECT DISTINCT user_id FROM profiles WHERE admin_verified IS TRUE "
USERS_QUERY += "AND admin_rejected='false@false@false' "
USERS_QUERY += "AND tester IS NOT TRUE AND deleted_at IS NULL;"


connection = open_conn()

users_list = gather_data(USERS_QUERY, connection)
print(users_list.tail(20))

cursor = connection.cursor()


# sql = 'INSERT INTO events (id, created_at, updated_at, deleted_at, name, location, small_description, description, picture)'
# sql += 'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)'

# event_id = str(uuid.uuid4())
# created = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
# updated = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
# deleted = None
# name = 'Fake event'
# location = 'Berlin'
# small_desc = 'Test event'
# description = 'description'
# picture = ''

# # Execute the query
# cursor.execute(sql, (event_id, created, updated, deleted, name, location, small_desc, description, picture))

# # the connection is not autocommited by default. So we must commit to save our changes.
# connection.commit()


# sql = 'INSERT INTO event_times (id, created_at, updated_at, deleted_at, event_id, year, month, day, hour, minute)'
# sql += 'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'

# new_id = str(uuid.uuid4())
# created = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
# updated = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
# deleted = None
# year = datetime.datetime.now().year
# month = datetime.datetime.now().month
# day = datetime.datetime.now().day
# hour = datetime.datetime.now().hour
# minute = datetime.datetime.now().minute


# # Execute the query
# cursor.execute(sql, (new_id, created, updated, deleted, event_id, year, month, day, hour, minute))

# # the connection is not autocommited by default. So we must commit to save our changes.
# connection.commit()

sql = 'INSERT INTO event_joins (id, created_at, updated_at, deleted_at, event_id, user_id)'
sql += 'VALUES (%s, %s, %s, %s, %s, %s)'

for user in users_list['user_id'].iloc[:2]:
        
    new_id = str(uuid.uuid4())
    created = datetime.datetime.utcnow()
    updated = datetime.datetime.utcnow()
    deleted = None
    event_id = '6ecc22ac-2213-408a-ba85-4dfbe9329914'
    
    

    # Execute the query
    cursor.execute(sql, (new_id, created, updated, deleted, event_id, user))

    # the connection is not autocommited by default. So we must commit to save our changes.
    connection.commit()

close_conn(connection)


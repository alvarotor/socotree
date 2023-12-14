import pandas as pd
import numpy as np
import os
import sys
import uuid
import datetime
import psycopg2
from sqlalchemy import create_engine

POSTGRES_HOST=os.environ.get('POSTGRES_HOST')
POSTGRES_PORT=os.environ.get('POSTGRES_PORT')
POSTGRES_DB=os.environ.get('POSTGRES_DB')
POSTGRES_USER=os.environ.get('POSTGRES_USER')
POSTGRES_PASSWORD=os.environ.get('POSTGRES_PASSWORD')
 
 # open a connection
def open_conn():
    try:
        connection = psycopg2.connect(user = POSTGRES_USER,
                                      password = POSTGRES_PASSWORD,
                                      host = POSTGRES_HOST,
                                      port = POSTGRES_PORT,
                                      database = POSTGRES_DB)
        print('Connection stablished')
        cur = connection.cursor()
        print('PostgreSQL database version:')
        cur.execute('SELECT version()')
        db_version = cur.fetchone()
        print(db_version)

        return connection

    except (Exception, psycopg2.Error) as error:
        print ("Error while connecting to PostgreSQL", error)
       
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

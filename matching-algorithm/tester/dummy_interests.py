import pandas as pd
import numpy as np
import os
import sys
import uuid
import datetime
import psycopg2
from sqlalchemy import create_engine
import random
from connection_functions import *

# POSTGRES_HOST=os.environ.get('POSTGRES_HOST')
# POSTGRES_PORT=os.environ.get('POSTGRES_PORT')
# POSTGRES_DB=os.environ.get('POSTGRES_DB')
# POSTGRES_USER=os.environ.get('POSTGRES_USER')
# POSTGRES_PASSWORD=os.environ.get('POSTGRES_PASSWORD')

INTERESTS_QUERY = 'SELECT id, name FROM interests WHERE admin_verified = True;'
USER_INTERESTS_QUERY = 'SELECT user_id, interest_id FROM user_interests;'

hobbies_list = ['Reading books', 'Blogging', 'Dancing', 'Singing', 'Listening to music',
                'Playing musical instruments', 'Learning new languages', 'Shopping',
                'Traveling', 'Hiking', 'Cycling', 'Exercising', 'Drawing', 'Painting',
                'Collecting things', 'Playing computer games', 'Cooking', 'Baking',
                'Gardening', 'Doing crafts (handmade)', 'Embroidering', 'Sewing', 'Knitting',
                'Playing board games', 'Role Playing Games', 'Walking', 'Writing stories',
                'Fishing', 'Photography', 'Skydiving', 'Skating', 'Skiing', 'Roller skating',
                'Longboarding', 'Surfing', 'Watching films', 'Watching series']

def create_dummy_interests(new_list):
    connection = open_conn()
    interests_df = gather_data(INTERESTS_QUERY, connection)
    close_conn(connection)

    df = pd.DataFrame(columns=['id', 'name'])
    
    df = df.set_index('id')      


    for item in new_list:
        df.loc[uuid.uuid4()] = item
    
    for item in df.index:
        df.loc[item,'weight'] = random.randint(1,5)
        
    df['created_at'] = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
    df['updated_at'] = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
    df['deleted_at'] = None
    df['uuid'] = ''
    df['admin_verified'] = True

    df = df.reset_index()

    order_cols = ['id', 'created_at', 'updated_at', 'deleted_at', 'name', 'uuid', 'admin_verified', 'weight'] 
    
    df = df[order_cols] 
    
    return df 

df = create_dummy_interests(hobbies_list)


from sqlalchemy import create_engine
engine = create_engine(f'postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}')

df.to_sql('interests', engine, if_exists='append', index=False)

import pandas as pd
import numpy as np
import os
import sys
import uuid
import datetime
import psycopg2
from sqlalchemy import create_engine
from connection_functions import *
import psycopg2.extras


INTERESTS_QUERY = 'SELECT id, name FROM interests WHERE admin_verified == True;'
USER_INTERESTS_QUERY = 'SELECT user_id, interest_id FROM user_interests;'

import random
from scoring_functions import *

connection = open_conn()

new_query = 'SELECT id, name FROM interests;'
interests_df = gather_data(new_query, connection)

close_conn(connection)

sql = 'INSERT INTO profiles (id, created_at, updated_at, deleted_at, name, photo, phone_prefix, phone, admin_verified,'
sql += 'news_update, admin, age_year, age_month, age_day, gender, user_id, fcm_token, profession, district, login,'
sql += 'admin_rejected, push_notification_switch, emails_switch, logged, platform, build, last_circle, tester) '
sql += 'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'

sql2 = 'INSERT INTO users (id, created_at, updated_at, deleted_at, email, password) '
sql2 += 'VALUES (%s, %s, %s, %s, %s, %s)'


connection = open_conn()

cursor = connection.cursor()

users_list = []

psycopg2.extras.register_uuid()

for n in range(20):
    new_id = uuid.uuid4()   
    new_created_at = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
    new_updated_at = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
    new_deleted_at = None
    new_name = f'pedorro_{n}'
    new_photo = ''
    new_phone_prefix = ''
    new_phone = ''
    new_admin_verified = True
    new_news_update = False
    new_admin = False
    new_age_year = random.randint(1970, 2002)
    new_age_month = random.randint(1,12)
    new_age_day = random.randint(1,25)
    new_gender = random.randint(0,1)
    new_user_id = uuid.uuid4()
    new_fcm_token = ''
    new_profession = ''
    new_district = 1
    new_login = 'email'
    new_admin_rejected = 'false@false@false'
    new_push_notifications_switch = False
    new_emails_switch = False
    new_logged = False
    new_platform = ''
    new_build = 0
    new_last_circle = '0001-01-01 00:00:00+00'
    new_tester = False
    new_email = f'pedorro_{n}@pedorro.com'
    new_password = 'gatitas'

    users_list.append(new_user_id)

    cursor.execute(sql2, (new_user_id, new_created_at, new_updated_at, new_deleted_at, new_email, new_password))

    # Execute the query
    cursor.execute(sql, (new_id, new_created_at, new_updated_at, new_deleted_at, new_name, new_photo, new_phone_prefix, new_phone,
                         new_admin_verified, new_news_update, new_admin, new_age_year, new_age_month, new_age_day, new_gender,
                         new_user_id, new_fcm_token, new_profession, new_district, new_login, new_admin_rejected,
                         new_push_notifications_switch, new_emails_switch, new_logged, new_platform, new_build, new_last_circle, new_tester))

    

    # the connection is not autocommited by default. So we must commit to save our changes.
    connection.commit()

# users_list = pd.DataFrame(users_list)

# interests = interests_df['id'].to_list()

# for item in interests:
#     users_list[item] = 0
    
# users_list.loc[:,:] = np.random.randint(0,2,size=(20,39))

# cursor = connection.cursor()

# sql = 'INSERT INTO user_interests (id, created_at, updated_at, deleted_at, user_id, interest_id)'
# sql += 'VALUES (%s, %s, %s, %s, %s, %s)'

# for item in users_list.index: 
#     user_int_list = users_list.loc[item, users_list.loc[item, :]==1].index
        
#     created = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
#     updated = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
#     deleted = None
    
#     for hobby in user_int_list:
#             new_id = uuid.uuid4()

#             # Execute the query
#             cursor.execute(sql, (new_id, created, updated, deleted, item, hobby))

#             # the connection is not autocommited by default. So we must commit to save our changes.
#             connection.commit()


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

for user in users_list:
        
    new_id = str(uuid.uuid4())
    created = datetime.datetime.utcnow()
    updated = datetime.datetime.utcnow()
    deleted = None
    event_id = '591d002f-e29e-41e4-acb3-831e1c46d3d8'
    
    

    # Execute the query
    cursor.execute(sql, (new_id, created, updated, deleted, event_id, user))

    # the connection is not autocommited by default. So we must commit to save our changes.
    connection.commit()

close_conn(connection)

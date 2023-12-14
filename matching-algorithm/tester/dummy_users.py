POSTGRES_HOST='localhost'
POSTGRES_PORT='5432'
POSTGRES_DB='testing'
POSTGRES_USER='testing'
POSTGRES_PASSWORD='testing'

INTERESTS_QUERY = 'SELECT id, name FROM interests;'
#INTERESTS_QUERY = 'SELECT id, name FROM interests WHERE admin_verified == True;'
USER_INTERESTS_QUERY = 'SELECT user_id, interest_id FROM user_interests;'

import pandas as pd
import uuid
import datetime
import random
from scoring_functions import *
from connection_functions import *

interests_df = pd.DataFrame()

connection = open_conn()

new_query = 'SELECT id, name FROM interests;'
interests_df = interests_df.append(pd.read_sql_query(new_query, connection))

close_conn(connection)

sql = 'INSERT INTO profiles (id, created_at, updated_at, deleted_at, name, photo, phone_prefix, phone, admin_verified,'
sql += 'news_update, admin, age_year, age_month, age_day, gender, user_id, fcm_token, profession, district, login,'
sql += 'admin_rejected, push_notification_switch, emails_switch, logged, platform, build, last_circle) '
sql += 'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'


connection = open_conn()

cursor = connection.cursor()

for n in range(48):
    new_id = uuid.uuid4()   
    new_created_at = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
    new_updated_at = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
    new_deleted_at = None
    new_name = f'user_{n}'
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

    # Execute the query
    cursor.execute(sql, (new_id, new_created_at, new_updated_at, new_deleted_at, new_name, new_photo, new_phone_prefix, new_phone,
                         new_admin_verified, new_news_update, new_admin, new_age_year, new_age_month, new_age_day, new_gender,
                         new_user_id, new_fcm_token, new_profession, new_district, new_login, new_admin_rejected,
                         new_push_notifications_switch, new_emails_switch, new_logged, new_platform, new_build, new_last_circle))

    # the connection is not autocommited by default. So we must commit to save our changes.
    connection.commit()

close_conn(connection)


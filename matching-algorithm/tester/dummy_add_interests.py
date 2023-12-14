INTERESTS_QUERY = 'SELECT id, name FROM interests WHERE admin_verified = True;'
USER_INTERESTS_QUERY = 'SELECT user_id, interest_id FROM user_interests;'
USERS_QUERY = 'SELECT user_id FROM profiles;'

from scoring_functions import *
from connection_functions import *


connection = open_conn()

interests_list = gather_data(INTERESTS_QUERY,connection)
users_list = gather_data(USERS_QUERY, connection)

close_conn(connection)

users_list = users_list.set_index('user_id')

interests = interests_list['id'].to_list()

for item in interests:
    users_list[item] = 0
    
users_list.loc[:,:] = np.random.randint(0,2,size=(48,39))

connection = open_conn()

cursor = connection.cursor()

sql = 'INSERT INTO user_interests (id, created_at, updated_at, deleted_at, user_id, interest_id)'
sql += 'VALUES (%s, %s, %s, %s, %s, %s)'

for item in users_list.index: 
    user_int_list = users_list.loc[item, users_list.loc[item, :]==1].index
        
    created = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
    updated = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
    deleted = None
    
    for hobby in user_int_list:
            new_id = uuid.uuid4()

            # Execute the query
            cursor.execute(sql, (new_id, created, updated, deleted, item, hobby))

            # the connection is not autocommited by default. So we must commit to save our changes.
            connection.commit()

close_conn(connection)
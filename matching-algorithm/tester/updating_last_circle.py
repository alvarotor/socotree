from connection_functions import *
import pandas as pd

USERS_QUERY = "SELECT user_id FROM profiles;"

LAST_QUERY = "SELECT created_at FROM circles WHERE user_id = '{}' AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 1;"

LAST_CIRCLE_UPDATE = "UPDATE profiles SET last_circle='{}' WHERE user_id='{}';"

connection = open_conn()


users_list = gather_data(USERS_QUERY, connection)['user_id'].to_list()

cursor = connection.cursor()

for n in range(len(users_list)):
    user_id = users_list[n]
    last_cir = gather_data(LAST_QUERY.format(user_id), connection)
                
    if last_cir.size == 1:
        try:
            new_date = last_cir.iloc[0].values[0].astype(str).replace('T', ' ')

            # Execute the query
            cursor.execute(LAST_CIRCLE_UPDATE.format(new_date, user_id))
            
            # the connection is not autocommited by default. So we must commit to save our changes.
            connection.commit()
        except:
            print('Nope')
            
        # the connection is not autocommited by default. So we must commit to save our changes.
        connection.commit()
                
close_conn(connection)
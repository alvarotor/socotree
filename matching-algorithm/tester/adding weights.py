from connection_functions import *
import pandas as pd


weights_df = pd.read_csv('weights.csv', sep=':', decimal=',', names=['Hobbies', 'Weight'])

print(weights_df)


# weights_dict = {}

# cursor = connection.cursor()
        
#             for n in range(len(df)):
#                 last_circle = df.loc[n]['updated_at']
#                 user_id = df.loc[n]['user_id']
                
#                 # Execute the query
#                 cursor.execute(self.CIRCLE_UPDATE,(last_circle, user_id))
        
#                 # the connection is not autocommited by default. So we must commit to save our changes.
#                 connection.commit()
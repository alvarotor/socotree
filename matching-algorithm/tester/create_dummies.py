INTERESTS_QUERY = 'SELECT id, name FROM interests WHERE admin_verified == True;'
USER_INTERESTS_QUERY = 'SELECT user_id, interest_id FROM user_interests;'

from scoring_functions import *

dummy_list =['1c064265-7979-405a-8351-fad70f8f47e0',
             'ed642909-85a8-4f83-9663-2ff194074906',
             '86740c47-acc5-4401-bbac-e2ac2e18d2f1',
             '1a7f97df-0c02-43e3-b60e-8f7648f6e3f2',
             '36738d70-6483-4101-ac39-b9ee0565325d']

import uuid
import datetime
import pickle







connection = open_conn()

interests_df = gather_data(INTERESTS_QUERY, connection)

close_conn(connection)

interests_df = interests_df.set_index('id')

hobbies_list = ['Reading books', 'Blogging', 'Dancing', 'Singing', 'Listening to music',
                'Playing musical instruments', 'Learning new languages', 'Shopping',
                'Traveling', 'Hiking', 'Cycling', 'Exercising', 'Drawing', 'Painting',
                'Collecting things', 'Playing computer games', 'Cooking', 'Baking',
                'Gardening', 'Doing crafts (handmade)', 'Embroidering', 'Sewing', 'Knitting',
                'Playing board games', 'Playing Role Playing Games', 'Walking', 'Writing stories',
                'Fishing', 'Photography', 'Skydiving', 'Skating', 'Skiing', 'Roller skating',
                'Longboarding', 'Surfing', 'Watching films', 'Watching series']

for item in hobbies_list:
    interests_df.loc[uuid.uuid4()]=item
    
interests_df['created at'] = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
interests_df['updated at'] = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
interests_df['deleted at'] = None
interests_df['uuid'] = ''
interests_df['admin_verified'] = true
interests_df = interests_df.reset_index()

order_cols = ['id', 'created at', 'updated at', 'deleted at', 'name', 'uuid', 'admin_verified'] 

interests_df = interests_df[order_cols]   
       
print(interests_df.T)


'''


def new_scores(df):
    df['id'] = [uuid.uuid4() for n in range(len(df))]
    df['created at'] = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
    df['updated at'] = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
    df['deleted at'] = None

    order_cols = ['id', 'created at', 'updated at', 'deleted at', 'user_id1', 'user_id2', 'score']
    df = df[order_cols]
    
    return df

for n in range(50):
    df['interest_'+str(n)]=0

for n in range(200):
    df.loc[uuid.uuid1()]=0
'''
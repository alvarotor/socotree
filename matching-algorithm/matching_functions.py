'''
Creates a class that automatizes the process of making the circles
Classes:
    Matcher
'''
from connection_functions import *
from scoring_functions import *
import pandas as pd
import uuid
import datetime
from sqlalchemy import create_engine
import numpy as np
import os

class Matcher:
    ''' This class makes the macthes for the circles'''
    # variables for connecting 
    POSTGRES_HOST=os.environ.get('POSTGRES_HOST')
    POSTGRES_PORT=os.environ.get('POSTGRES_PORT')
    POSTGRES_DB=os.environ.get('POSTGRES_DB')
    POSTGRES_USER=os.environ.get('POSTGRES_USER')
    POSTGRES_PASSWORD=os.environ.get('POSTGRES_PASSWORD')

    # variables for sending queries
    USERS_QUERY = "SELECT user_id, age_year FROM profiles "
    USERS_QUERY += "WHERE admin_verified IS TRUE AND admin_rejected='false@false@false' "
    USERS_QUERY += "AND tester IS NOT TRUE AND last_circle <= NOW() - INTERVAL '3 DAYS' "
    USERS_QUERY += "AND deleted_at IS NULL;"
    
    MATCHED_QUERY = "SELECT user_id FROM circles WHERE circle_id IN "
    MATCHED_QUERY += "(SELECT circle_id FROM circles WHERE user_id = '{}');"
    
    LANGUAGES_QUERY = "SELECT id, answer FROM answers WHERE question_id='d8030f72-b8e9-440d-9503-647a397b907c' "
    LANGUAGES_QUERY += "AND deleted_at IS NULL;"
    
    DELETE_QUERY = 'DELETE FROM users_scores_mas'

    CIRCLE_UPDATE = "UPDATE profiles SET last_circle= %s WHERE user_id= %s "    
    
    def getting_users(self, connection):
        # getting unassigned users
        avail_users = gather_data(self.USERS_QUERY, connection)
        
        return avail_users
    
    def selecting(self, avail_users, connection):
      
        # age filter
        user_00 = avail_users['user_id'].to_list()[0]
        user_00_year = avail_users['age_year'].to_list()[0]
        dif_year = user_00_year - avail_users['age_year']
        age_mask = (np.abs(dif_year) < 4)

        # sorting out previous matched users            
        matched_df = gather_data(self.MATCHED_QUERY.format(user_00, user_00), connection)
        matched_list = matched_df['user_id'].to_list()
        matched_list.append(user_00)
        
        # applying filters            
        users_list = avail_users.loc[age_mask, 'user_id'].to_list()
        users_list = [ x for x in users_list if x not in matched_list ]
        
        return user_00, users_list
    
    def lang_filter(self, user_00, users_list, connection):
        # Retrieving the categories
        lang_df = gather_data(self.LANGUAGES_QUERY, connection)
        # lang_dict = dict(zip(lang_df['id'], lang_df['answer']))
        
        # Finding out the category of user_00 and users_list
        # adding user_00 to users_list
        users_list.insert(0, user_00)
        
        # creating the list for the query
        users_str = '('
        for user in users_list:
            users_str += f"'{user}', "
        users_str = users_str[:-2]
        users_str += ')'
        
        # creating the query
        LANG_USERS_QUERY = f"SELECT user_id, answer_id FROM user_answers WHERE user_id IN {users_str}"
        LANG_USERS_QUERY += "AND question_id='d8030f72-b8e9-440d-9503-647a397b907c' "
        LANG_USERS_QUERY += "AND deleted_at IS NULL;"
        
        # retrieving language answers for the users in the list
        lang_users_df = gather_data(LANG_USERS_QUERY, connection)        
        
        # merging them with a users dataframe
        lang_matrix = pd.DataFrame(users_list, columns=['user_id'])
        lang_matrix = lang_matrix.merge(lang_users_df, how='left', on='user_id')
        
        # filling the missing values with the value for user_00
        lang_user_00 = lang_matrix.loc[0, 'answer_id']
        lang_matrix['answer_id'] = lang_matrix['answer_id'].fillna(lang_user_00)
        
        if lang_matrix['answer_id'].isnull().any():
            users_list.remove(user_00)
            return users_list
        else:
            # filtering out
            lang_matrix = lang_matrix.loc[lang_matrix['answer_id']==lang_user_00]
            users_list = lang_matrix['user_id'].to_list()
            users_list.remove(user_00)
            return users_list        

    def matching_alg(self, user_00, users_list, connection):
                
        scorer = Scorer()
        df_00 = scorer.scoring(user_00, users_list, connection)
        
        # choosing the n best matches and adding them to a list (actual n=1)
        circle_list = df_00.sort_values(by=['score'], ascending=False)['user_id2'].astype(str).to_list()
        circle_list = circle_list[:1]
        
        # defining the quality threshold as a percentage (actual 45%)
        if len(circle_list)!=0:
            for item in circle_list:
                if df_00.loc[df_00['user_id2'] == item, 'score'] < 45:
                    circle_list.remove(item)
        
        # adding user_00 to the circle list
        circle_list.append(user_00)
    
        return circle_list
        
    def writing_circle(self, circle_list, connection):
        if len(circle_list) < 2:
            return

        df = pd.DataFrame()
        df['user_id'] = circle_list
        df['id'] = [uuid.uuid4() for n in range(len(df))]    
        df['created_at'] = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
        df['updated_at'] = datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)
        df['deleted_at'] = None
        df['circle_id'] = uuid.uuid4()
        df['notified_pn'] = False
        df['notified_email'] = False
        
        engine = create_engine('postgresql+psycopg2://{}:{}@{}:{}/{}'.format(self.POSTGRES_USER, self.POSTGRES_PASSWORD,
                                                                              self.POSTGRES_HOST, self.POSTGRES_PORT,
                                                                              self.POSTGRES_DB))
        
        df.to_sql('circles', engine, if_exists='append', index=False)    
            
        cursor = connection.cursor()
        
        for n in range(len(df)):
            last_circle = df.loc[n]['updated_at']
            user_id = df.loc[n]['user_id']
                
            # Execute the query
            cursor.execute(self.CIRCLE_UPDATE,(last_circle, user_id))
        
            # the connection is not autocommited by default. So we must commit to save our changes.
            connection.commit()
                
    def cleaning_list(self, avail_users, circle_list):

        avail_users = avail_users.loc[~avail_users.user_id.isin(circle_list)]
        
        return avail_users
        
                
    def matching(self):
           
        connection = open_conn()
    
        flag = 1
        
        avail_users = self.getting_users(connection)
    
        while len(avail_users) > 0:
        
            user_00, users_list = self.selecting(avail_users, connection)
            
            users_list = self.lang_filter(user_00, users_list, connection)
        
            circle_list = self.matching_alg(user_00, users_list, connection)
            
            self.writing_circle(circle_list, connection)
            
            avail_users = self.cleaning_list(avail_users, circle_list)
        
        close_conn(connection)

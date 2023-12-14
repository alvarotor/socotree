'''
Creates a class that automatizes the process of making the event matching

Classes:

    EMatcher
'''
from connection_functions import *
from scoring_functions import *
from reporting import *
import pandas as pd
import uuid
import datetime
from sqlalchemy import create_engine
import numpy as np


class EMatcher:
    ''' This class makes the macthes for the events (old system)'''

    logger = Reporter(debug=True)

    def __init__(self, dashboard, event_id, circlesize, recircle, ageflag, prematch, langflag):
        self.dashboard = dashboard
        self.event_id = event_id
        self.circlesize = circlesize
        self.recircle = recircle
        self.ageflag = ageflag
        self.prematch = prematch
        self.langflag = langflag

    def setting_flags(self):
        self.logger.info('Setting flags...')

        if self.dashboard:
            self.logger.dev_info('  ----  Flags (Dashboard) ----')

        else:
            FLAG_QUERY = "SELECT age, pre_match, lang, re_circle, circle_size FROM events "
            FLAG_QUERY += f"WHERE id = '{self.event_id}' AND deleted_at IS NULL;"

            flags_df = gather_data(FLAG_QUERY, self.connection).fillna(False)

            self.circlesize = flags_df.loc[0,'circle_size']
            self.recircle = flags_df.loc[0,'re_circle']
            self.ageflag = flags_df.loc[0,'age']
            self.prematch = flags_df.loc[0,'pre_match']
            self.langflag = flags_df.loc[0,'lang']

            self.logger.dev_info('  ----  Flags (Event) ----')

        self.logger.dev_info(f'circlesize -> {self.circlesize}')
        self.logger.dev_info(f'recircle -> {self.recircle}')
        self.logger.dev_info(f'ageflag -> {self.ageflag}')
        self.logger.dev_info(f'prematch -> {self.prematch}')
        self.logger.dev_info(f'langflag -> {self.langflag}\n')

    def doublecall(self):
        DOUBLECALL_QUERY = "SELECT event_id FROM circles WHERE deleted_at IS NULL;"

        double_df = gather_data(DOUBLECALL_QUERY, self.connection)
        matched_events = set(double_df['event_id'].to_list())

        dcall = self.event_id in matched_events

        return dcall

    def getting_users(self):
        USERS_QUERY = "SELECT DISTINCT ON(user_id) user_id, age_year FROM profiles "
        USERS_QUERY += "WHERE (admin_rejected_name IS NULL OR admin_rejected_name IS FALSE) "
        USERS_QUERY += "AND (admin_rejected_dob IS NULL OR admin_rejected_dob IS FALSE) "
        USERS_QUERY += "AND (admin_rejected_photo IS NULL OR admin_rejected_photo IS FALSE) "
        USERS_QUERY += "AND (admin_rejected_interests IS NULL OR admin_rejected_interests IS FALSE) "
        USERS_QUERY += "AND (admin_rejected_questions IS NULL OR admin_rejected_questions IS FALSE) "
        USERS_QUERY += "AND (admin_rejected_district IS NULL OR admin_rejected_district IS FALSE) "
        USERS_QUERY += "AND deleted_at IS NULL AND user_id IN "
        USERS_QUERY += "(SELECT user_id FROM event_joins "
        USERS_QUERY += f"WHERE event_id = '{self.event_id}') AND deleted_at IS NULL;"

        # getting unassigned users
        avail_users = gather_data(USERS_QUERY, self.connection)

        self.logger.dev_info(f'List of available users: {avail_users.user_id.tolist()}\n')

        return avail_users

    def selecting(self, avail_users):
        MATCHED_QUERY = "SELECT user_id FROM circles WHERE deleted_at IS NULL AND user_id != '{}' AND circle_id IN "
        MATCHED_QUERY += "(SELECT circle_id FROM circles WHERE user_id = '{}' AND deleted_at IS NULL);"

        user_00 = avail_users['user_id'].to_list()[0]

        self.logger.dev_info(f'user00 -> {user_00}')
        self.logger.dev_info(f'A total of {len(avail_users)-1} possible users\n')

        # age filter
        if self.ageflag == True:
            self.logger.info('Applying age filter')
            user_00_year = avail_users['age_year'].to_list()[0]
            dif_year = user_00_year - avail_users['age_year']
            age_mask = (np.abs(dif_year) < 6)
            users_list = avail_users.loc[age_mask, 'user_id'].to_list()
            self.logger.dev_info(f'A total of {len(users_list)-1} after age filter\n')
        else:
            users_list = avail_users['user_id'].to_list()
        

        # sorting out previous matched users
        self.logger.info('Applying prematch filter')
        if self.prematch:
            matched_df = gather_data(MATCHED_QUERY.format(user_00, user_00), self.connection)
            matched_list = matched_df['user_id'].to_list()
            users_list = [x for x in users_list if x not in matched_list]
            self.logger.dev_info(f'A total of {len(users_list)-1} after prematch filter\n')
        
        users_list.remove(user_00)

        return user_00, users_list

    def lang_filter(self, user_00, users_list):
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
        lang_users_df = gather_data(LANG_USERS_QUERY, self.connection)

        # merging them with a users dataframe (for avoiding users without selected lang preference)
        lang_matrix = pd.DataFrame(users_list, columns=['user_id'])
        lang_matrix = lang_matrix.merge(lang_users_df, how='left', on='user_id')

        # filling the missing values with the value for user_00
        lang_user_00 = lang_matrix.loc[0, 'answer_id']
        lang_matrix['answer_id'] = lang_matrix['answer_id'].fillna(lang_user_00)

        # In case user_00 has no selected lang preference
        if lang_matrix['answer_id'].isnull().any():
            users_list.remove(user_00)
            return users_list

        # If it does we continue filtering
        # For english we filter out "only german"
        # For german we filter out "only english"
        if lang_user_00 == 'eebfa949-d05b-426a-9096-6ce6da9aed47':
            lang_matrix = lang_matrix.loc[lang_matrix['answer_id'] != 'd24358ae-f9f5-4d5c-80b9-046d7a6c9bf7']
        elif lang_user_00 == 'd24358ae-f9f5-4d5c-80b9-046d7a6c9bf7':
            lang_matrix = lang_matrix.loc[lang_matrix['answer_id'] != 'eebfa949-d05b-426a-9096-6ce6da9aed47']
        
        users_list = lang_matrix['user_id'].to_list()
        users_list.remove(user_00)
        return users_list

    def matching_alg(self, user_00, users_list):

        scorer = Scorer(self.ageflag)
        df_00 = scorer.scoring(user_00, users_list, self.connection)

        circle_list = df_00.sort_values(by=['score'], ascending=False)['user_id2'].astype(str).to_list()
        circle_list = circle_list[:self.circlesize-1]
        circle_list.append(user_00)

        return circle_list

    def writing_circle(self, circle_list):
        circle_id = uuid.uuid4()
        df = pd.DataFrame()
        df['user_id'] = circle_list
        df['id'] = [uuid.uuid4() for n in range(len(df))]
        df['created_at'] = datetime.datetime.utcnow()
        df['updated_at'] = datetime.datetime.utcnow()
        df['deleted_at'] = None
        df['circle_id'] = circle_id
        df['notified_pn'] = False
        df['notified_email'] = False
        df['event_id'] = self.event_id

        engine = create_engine('postgresql+psycopg2://{}:{}@{}:{}/{}'.format(POSTGRES_USER, POSTGRES_PASSWORD,
                                                                             POSTGRES_HOST, POSTGRES_PORT,
                                                                             POSTGRES_DB))

        df.to_sql('circles', engine, if_exists='append', index=False)

        self.ncircles += 1
        self.circles_list.append(circle_id)

    def cleaning_list(self, avail_users, circle_list):

        avail_users = avail_users.loc[~avail_users.user_id.isin(circle_list)]

        return avail_users

    def joining_unmatched(self, event_id):
        n = len(self.unmatched)
        if n == 0:
            self.logger.info('No unmatched users.')
        else:
            self.logger.info(f'Dealing with {len(self.unmatched)} unmatched users.')
            new_circles = int(n//self.circlesize)
            out_circles = n % self.circlesize
        
            if out_circles == 0:
                new_circles_list = [uuid.uuid4() for n in range(new_circles)]
                self.circles_list += new_circles_list
                self.ncircles = len(self.circles_list)
                unmatched_circle_list = new_circles_list*self.circlesize
            elif out_circles == 1:
                new_circles_list = [uuid.uuid4() for n in range(new_circles)]
                self.circles_list += new_circles_list
                self.ncircles = len(self.circles_list)
                unmatched_circle_list = new_circles_list*self.circlesize + self.circles_list[-1:]
            else:
                new_circles_list = [uuid.uuid4() for n in range(new_circles+1)]
                self.circles_list += new_circles_list
                self.ncircles = len(self.circles_list)
                unmatched_circle_list = new_circles_list*self.circlesize
                unmatched_circle_list = unmatched_circle_list[:-self.circlesize+out_circles]

            df = pd.DataFrame()
            df['user_id'] = self.unmatched
            df['id'] = [uuid.uuid4() for i in range(n)]
            df['created_at'] = datetime.datetime.utcnow()
            df['updated_at'] = datetime.datetime.utcnow()
            df['deleted_at'] = None
            df['circle_id'] = unmatched_circle_list
            df['notified_pn'] = False
            df['notified_email'] = False
            df['event_id'] = event_id

            engine = create_engine('postgresql+psycopg2://{}:{}@{}:{}/{}'.format(POSTGRES_USER, POSTGRES_PASSWORD,
                                                                                POSTGRES_HOST, POSTGRES_PORT,
                                                                                POSTGRES_DB))

            df.to_sql('circles', engine, if_exists='append', index=False)

    def matching(self):
        self.unmatched = []
        self.circles_list = []


        print('\n\n------------')
        self.logger.info(f'Starting matching for event {self.event_id}\n')

        self.connection = open_conn()

        self.setting_flags()
 
        if not self.recircle:
            self.logger.info('Running doublecall check...')
            if self.doublecall():
                self.logger.info('Event already matched. Canceling the matching\n')
                return 0, 0
            else:
                self.logger.info('Event not yet matched: continuing process\n')

        try:
            self.logger.info('Getting users')
            avail_users = self.getting_users()
        except:
            self.logger.handling_error()
            raise 

        total_users = len(avail_users)
        self.logger.dev_info(f'Total: {total_users} users.')
        
        self.ncircles = 0

        self.logger.info('Starting to match users\n')
        while len(avail_users) > 0:

            self.logger.info('Selecting users')
            user_00, users_list = self.selecting(avail_users)
            
            if self.langflag:
                self.logger.info('Applying language filter')
                users_list = self.lang_filter(user_00, users_list)
                self.logger.dev_info(f'A total of {len(users_list)} after language filter\n')

            self.logger.info('Generating the circle list')
            circle_list = self.matching_alg(user_00, users_list)

            self.logger.info(f'Sugested circle -> {circle_list}\n')

            if len(circle_list) < self.circlesize:
                self.unmatched += circle_list
                self.logger.info('Not enough people for matching that user\n')
            else:
                self.logger.info('Writing circle in the database...', e=True)
                self.writing_circle(circle_list)
                self.logger.info(' done!\n', d=False)

            self.logger.info('Deleting user(s) from the pool...', e=True)
            avail_users = self.cleaning_list(avail_users, circle_list)
            self.logger.info(' done!', d=False)
            self.logger.info('  ----  \n')

        self.logger.info('Pool is empty. Dealing with unmatched users')
        self.joining_unmatched(self.event_id)
        self.logger.info(' ... finished!\n')
        close_conn(self.connection)

        self.logger.info(f'Total {self.ncircles} circles added.')
        self.logger.info('Process finished')

        return total_users, self.ncircles

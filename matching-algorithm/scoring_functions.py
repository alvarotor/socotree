import pandas as pd
import numpy as np
import os
import sys
import uuid
import datetime
import psycopg2
from sqlalchemy import create_engine
from connection_functions import *


class Scorer:
    '''This class calculates the scores for making the matches'''

    # variables for sending queries
    INTERESTS_QUERY = 'SELECT id, name, weight FROM interests WHERE admin_verified = True AND deleted_at IS NULL;'
    USER_INTERESTS_QUERY = 'SELECT user_id, interest_id FROM user_interests WHERE deleted_at IS NULL;'
    SCORE_UPDATE = "UPDATE users_scores_mas SET score = %s WHERE id= %s "

    def __init__(self, ageflag):
        self.ageflag = ageflag


    def build_dataframe(self, users_list):
        '''
        Returns an empty dataframe using as index the elements of users_list
            Parameters:
                - users_list (list): List with the users to score with user_00
            Steps:
                - Creates an empty dataframe
                - Adds the column 'user_id' and sets it as index

            Returns:
                - df (pd.DataFrame): Dataframe with user_lists as indexes
        '''
        # creating the dataframe
        df = pd.DataFrame()

        # adding 'user_id', filling it with the values of users_list and reindexing
        df['user_id'] = pd.Series(users_list)
        df = df.set_index('user_id')

        return df

    # function for adding interests structure to a dataframe
    def add_interests(self, df, users_list, connection):
        '''
        Fills up the dataframe with the interests of the users in the list

            Parameters:
                - df (pd.Dataframe): dataframe where we are going to build the users-interests array
                - users_list (list): List with the users to score with user_00
            Steps:
                - Reads the table interests and collects interests and their ids
                - Zips the ids and names in a dictionary
                - Creates a column for each interest
                - Reads the users interests
                - Updates the dataframe with that info
            Returns:
                - df (pd.DataFrame): Dataframe with updated interests
        '''
        # collecting id and interests names
        # then zipping the names and ids in a dictionary
        interests_df = gather_data(self.INTERESTS_QUERY, connection)
        interest_dict = dict(zip(interests_df['id'], interests_df['name']))
        weight_dict = dict(zip(interests_df['id'], interests_df['weight']))

        # creating one feature for each interest
        # the columns are gonna be called 'interest_'+name
        # the default value is set to 0
        for item in interests_df['name'].values:
            df[f'interest_{item}'] = 0

        # gathering the data about the users interests
        user_int_df = gather_data(self.USER_INTERESTS_QUERY, connection)

        # updating the dataframe with the info about the interests
        for n in range(len(user_int_df)):
            # the values for filling the dataframe
            temp_user = user_int_df.loc[n, 'user_id']
            temp_interest = user_int_df.loc[n, 'interest_id']
            if temp_interest not in interest_dict.keys():
                pass
            else:
                temp_name_interest = interest_dict[temp_interest]
                temp_weight = weight_dict[temp_interest]

            # if the temp_user is in the list, change the value of the
            # interest to 1
            if temp_user in users_list:
                df.loc[temp_user,
                       f'interest_{temp_name_interest}'] = temp_weight

        return df

    # scoring algorithm
    def score_alg(self, df):
        '''
        Returns a dataframe with the scores

            Parameters:
                - df (pd.DataFrame): Dataframe with the interests for calculating the scores
            Steps:
                - Creates a dataframe by broadcasting the values of the first user (user_00)
                - Makes the simple product of the df and the new dataframe
                - 
                - Adds the column 'user_id' and sets it as index
            Returns:
                - scores (pd.DataFrame): Dataframe with the scores for the users
                            in users_list refered to the first element of the list
        '''

        # creating a dataframe like df broadcasting the interests of user_00
        user_00_df = df.apply(
            lambda x: df.iloc[0], axis=1, result_type='expand')
        user_00_df = user_00_df.astype(bool).astype(int)

        # creating the product matrix
        prod_df = df * user_00_df

        # setting the reference max number for this user
        max_num = prod_df.iloc[0].sum()

        # !!!!!!!!!!!!!!!!!!!!!!!
        # WARNING: SECURITY CHECK
        # !!!!!!!!!!!!!!!!!!!!!!!
        # If the user has 0 interests we turn max_num automatically to 1
        if max_num == 0:
            max_num = 1

        # here comes the age filter as a softfilter
        #if self.ageflag == 'soft':
        #    AGE_QUERY = "SELECT DISTINCT ON(user_id) user_id, age_year FROM profiles
        #    AGE_QUERY += f"WHERE  event_id = '{self.event_id}');"

        # here comes the formula for measuring the scores
        # current stand:
        # we count each interest match with a one and then divide by the maximum number for the user

        # calculating and adding the scores
        df['score'] = (prod_df.sum(axis=1)*100/max_num).round(3)

        # getting back user_00
        # putting the scores in a new dataframe
        # leaving user_00 out and adding it to column 'user_id1'
        user_00 = df.index[0]
        scores = df.iloc[1:, -1:]
        scores['user_id1'] = user_00

        return scores

    def scoring(self, user_00, users_list, connection):
        '''
        Assigns a matching SCORE to the users in users_list by comparing the values
        with user_00.

        It sets user_00 as first item in users list, then builds a dataframe with
        the user ids as index.
        Creates columns with the names of the interests and fills them with the
        values according to the database
        Finally uses the scoring algorithm for setting a score to each user.    

        Input:
            - user_00 (str): Corresponds to the id of the selected user
            - users_list (list): List of users that will get a score

        Output:
            - scores (pd.Series): with index the user ids and value the score
        '''
        # adding user_00 to the front of the list of users_list
        users_list.insert(0, user_00)

        # building the dataframe
        df = self.build_dataframe(users_list)

        # creating the columns for the interests and filling them
        df = self.add_interests(df, users_list, connection)

        # creating the scores
        df = self.score_alg(df)

        df['user_id2'] = df.index

        return df

import React, {useState, useContext} from 'react';
import {Alert} from 'react-native';
import DialogInput from 'react-native-dialog-input';
import crashlytics from '@react-native-firebase/crashlytics';
import {sendDeleteUser} from '../../core';
import ENV from '../../active.env';
import {track} from '../segment';

import {UserContext} from '../UserContext';

export const DialogDeletePopup = ({
  navigation,
  dialogDeleteUser,
  setDialogDeleteUser,
}) => {
  const {user} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  return (
    <DialogInput
      isDialogVisible={dialogDeleteUser}
      title={'Do you want to delete your user?'}
      message={
        'Type DELETE word and we will delete all your data. Dont forget that this action can not go back.'
      }
      hintInput={'DELETE'}
      initValueTextInput={ENV === 'dev' ? 'DELETE' : ''}
      submitInput={async () => {
        try {
          crashlytics().log('sendDeleteUser');
          track('sendDeleteUser', user);
          const delRes = await sendDeleteUser(user.token);
          if (delRes) {
            Alert.alert('Deleting user', 'User is deleted. Bye!', [
              {
                text: 'OK',
                onPress: async () => {
                  setDialogDeleteUser(false);
                  navigation.navigate('Start');
                },
              },
            ]);
          } else {
            throw new Error('User cant get deleted, got false from back end');
          }
        } catch (err) {
          console.log(err);
          if (err) {
            crashlytics().recordError(new Error(err));
            track('ERROR sendDeleteUser', {message: JSON.stringify(err)});
          }
          Alert.alert(
            'Deleting user',
            'Its not being possible to delete your user, please try again. ' +
              err.message,
          );
        }
      }}
      closeDialog={() => setDialogDeleteUser(false)}
    />
  );
};

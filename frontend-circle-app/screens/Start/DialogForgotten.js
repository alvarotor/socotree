import React from 'react';
import {Alert} from 'react-native';
import {sendForgottenPassword} from '../../core';
import DialogInput from 'react-native-dialog-input';
import crashlytics from '@react-native-firebase/crashlytics';
import ENV from '../../active.env';
import {track} from '../segment';

export const DialogForgotten = ({
  navigation,
  dialogForgotten,
  setDialogForgotten,
  emailAdmin,
}) => {
  const moveToPasswordVerificationCode = () => {
    setDialogForgotten(false);
    navigation.navigate('PasswordVerificationCode');
  };

  return (
    <DialogInput
      isDialogVisible={dialogForgotten}
      title={'Did you forget your password?'}
      message={
        'Type your email here and we will send to you there instrucctions how to proceed.'
      }
      hintInput={'Your email'}
      initValueTextInput={ENV === 'dev' ? emailAdmin : ''}
      submitInput={async (inputText) => {
        try {
          const email = inputText.toString().trim();
          if (email.length === 0) {
            Alert.alert(
              'Forgotten Password',
              'Email cannot be empty. Try again, please.',
            );
            return;
          }
          crashlytics().log('sendForgottenPassword');
          await sendForgottenPassword(email).then(() =>
            Alert.alert('Forgotten Password', 'Email sent to ' + email, [
              {
                text: 'OK',
                onPress: () => moveToPasswordVerificationCode(),
              },
            ]),
          );
        } catch (err) {
          if (err) {
            crashlytics().recordError(new Error(err));
            track('ERROR sendForgottenPassword', {
              message: JSON.stringify(err),
            });
          }
          Alert.alert(
            'Forgotten Password',
            `Email NOT sent to ${inputText}, ${err.message.toString()}. Try again.`,
          );
        }
      }}
      closeDialog={() => setDialogForgotten(false)}
    />
  );
};

import 'react-native-gesture-handler';
import React from 'react';
import {View, StyleSheet, TextInput, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Formik} from 'formik';
import VideoCall from './VideoCall';

const Stack = createStackNavigator();

function App() {
  const UserForm = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Formik
          initialValues={{
            email: 'alvaro@socotree.io',
            user: 'Alvaro',
            avatar: 'https:/gravatar.com/avatar/abc123',
            url: 'MyCircleChatRoom',
          }}
          onSubmit={(values, actions) => {
            const {user, avatar, email, url} = values;
            if (
              user.length === 0 ||
              avatar.length === 0 ||
              email.length === 0 ||
              url.length === 0
            ) {
              return;
            }
            // console.log(actions);
            // console.log(navigation);
            navigation.replace('Call', {
              user,
              avatar,
              email,
              url,
            });
          }}>
          {({handleSubmit, handleChange, handleBlur, values}) => (
            <View>
              <TextInput
                onChangeText={handleChange('user')}
                onBlur={handleBlur('user')}
                placeholder={'User'}
                value={values.user}
                style={styles.input}
              />
              <TextInput
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder={'email'}
                value={values.email}
                style={styles.input}
              />
              <TextInput
                onChangeText={handleChange('avatar')}
                onBlur={handleBlur('avatar')}
                placeholder={'avatar'}
                value={values.avatar}
                style={styles.input}
              />
              <TextInput
                onChangeText={handleChange('url')}
                onBlur={handleBlur('url')}
                placeholder={'url'}
                value={values.url}
                style={styles.input}
              />
              <Button onPress={handleSubmit} title={'Go Video Chat'} />
            </View>
          )}
        </Formik>
      </View>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={UserForm} />
        <Stack.Screen name="Call" component={VideoCall} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  input: {
    height: 44,
    width: 300,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});

export default App;

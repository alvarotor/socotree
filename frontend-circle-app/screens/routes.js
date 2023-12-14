import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import {updateUserData} from '../core';
import {Platform} from 'react-native';
import {UserContext} from './UserContext';
import {navigationRef, isReadyRef} from './navigationActions';
import {userRef} from './notifications';

import {StartScreen} from './Start';
import {FirstNameScreen} from './FirstName';
import {DOBScreen} from './DOB';
import {PhoneNumberScreen} from './PhoneNumber';
import {UploadPhotoScreen} from './UploadPhoto';
import {FoundYourCircleScreen} from './FoundYourCircle';
import {ChatScreen} from './Chat';
import {GroupVideoChatScreen} from './GroupVideoChat';
import {ProfessionScreen} from './Profession';
import {PerfectEveningScreen} from './PerfectEvening';
import {InterestsScreen} from './Interests';
import {SettingsScreen} from './Settings';
import {ProfileScreen} from './Profile';
import {NotificationsScreen} from './Notifications';
import {PasswordScreen} from './Password';
import {QuestionsScreen} from './Questions';
import {TermsOfUseScreen} from './TermsOfUse';
import {VerificationCodeScreen} from './VerificationCode';
import {PasswordVerificationCodeScreen} from './PasswordVerificationCode';
import {IncompleteProfileScreen} from './IncompleteProfile';
import {DistrictScreen} from './District';
import {VersionScreen} from './Version';
import {BlockedUsersScreen} from './BlockedUsers';
import {UpdateAppScreen} from './UpdateApp';
import {identify, track} from './segment';
import {EventsScreen} from './Events';
import {EventScreen} from './Event';
import {EventsRemindedScreen} from './EventsReminded';
import {EventBeginScreen} from './EventBegin';
import {EventMatchedScreen} from './EventMatched';
import {CirclesScreen} from './Circles';
import {ContactUsScreen} from './ContactUs';
import {EditProfileScreen} from './EditProfile';
import {UserPlaceScreen} from './UserPlace';
import {QuestionsEventScreen} from './Event/Questions';
import {SelectCityScreen} from './SelectCity';
import {OnboardingOneScreen} from './OnboardingOne';
import {OnboardingTwoScreen} from './OnboardingTwo';
import {OnboardingThreeScreen} from './OnboardingThree';
import {OnboardingFourScreen} from './OnboardingFour';
// import {KeepMePostedScreen} from './KeepMePosted';

const Stack = createStackNavigator();

export const Routes = () => {
  const {user, setUser} = useContext(UserContext);
  const [initialRoute, setInitialRoute] = useState(null); // let it null to be handled inside the logic, otherwise goes to that screen set here

  userRef.current = {...user};

  React.useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  useEffect(() => {
    const getInitialRouteName = async (u) => {
      setUser(u);
      await identify(u.userid, u.email, u.profile);
      if (u.profile.fcmtoken !== (await AsyncStorage.getItem('fcmToken'))) {
        await updateUserData(u)
          .then(async (userUpdated) => {
            u.profile = userUpdated;
            setUser(u);
            await AsyncStorage.setItem(
              'loginUser',
              JSON.stringify(userUpdated),
            );
            console.log(Platform.OS, 'fcmtoken updated');
            await track('Update fcmtoken', {userid: u.userid});
          })
          .catch((err) => {
            console.log(err);
            setInitialRoute('Start');
          });
      }
      if (!u.emailverified) {
        setInitialRoute('VerificationCode');
      } else {
        setInitialRoute('Events');
      }
    };

    const getLoginUser = async () => {
      // await AsyncStorage.removeItem('loginUser');
      const loginUser = await AsyncStorage.getItem('loginUser');
      if (loginUser) {
        const loginUserObj = JSON.parse(loginUser);
        if (loginUserObj && loginUserObj.profile) {
          getInitialRouteName(loginUserObj);
        } else {
          setInitialRoute('Start');
        }
      } else {
        // console.log('AsyncStorage.removeItem(selectedCity)', await AsyncStorage.removeItem('selectedCity'));
        // await AsyncStorage.removeItem('selectedCity');
        if ((await AsyncStorage.getItem('selectedCity')) !== null) {
          setInitialRoute('Start');
        } else {
          setInitialRoute('SelectCity');
        }
      }
    };

    getLoginUser();
  }, [setUser]);

  if (!initialRoute) {
    return null;
  }

  return (
    <NavigationContainer
      // onStateChange={(state) =>
      //   console.log('New NavigationContainer state is', state)
      // }
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        headerMode="screen"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}>
        <Stack.Screen name="SelectCity" component={SelectCityScreen} />
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen
          name="PasswordVerificationCode"
          component={PasswordVerificationCodeScreen}
        />
        <Stack.Screen
          name="FirstName"
          component={FirstNameScreen}
          initialParams={{settings: false}}
        />
        <Stack.Screen
          name="DOB"
          component={DOBScreen}
          initialParams={{settings: false}}
        />
        <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
        <Stack.Screen
          name="UploadPhoto"
          component={UploadPhotoScreen}
          initialParams={{settings: false}}
        />
        <Stack.Screen
          name="FoundYourCircle"
          component={FoundYourCircleScreen}
        />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="GroupVideoChat" component={GroupVideoChatScreen} />
        <Stack.Screen
          name="Profession"
          component={ProfessionScreen}
          initialParams={{settings: false}}
        />
        <Stack.Screen
          name="District"
          component={DistrictScreen}
          initialParams={{settings: false}}
        />
        <Stack.Screen
          name="Questions"
          component={QuestionsScreen}
          initialParams={{settings: false}}
        />
        <Stack.Screen
          name="Interests"
          component={InterestsScreen}
          initialParams={{settings: false}}
        />
        <Stack.Screen name="UserPlace" component={UserPlaceScreen} />
        <Stack.Screen name="PerfectEvening" component={PerfectEveningScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Password" component={PasswordScreen} />
        <Stack.Screen name="TermsOfUse" component={TermsOfUseScreen} />
        <Stack.Screen
          name="VerificationCode"
          component={VerificationCodeScreen}
        />
        <Stack.Screen
          name="IncompleteProfile"
          component={IncompleteProfileScreen}
        />
        <Stack.Screen name="Version" component={VersionScreen} />
        <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
        <Stack.Screen name="UpdateApp" component={UpdateAppScreen} />
        <Stack.Screen name="Events" component={EventsScreen} />
        <Stack.Screen name="Event" component={EventScreen} />
        <Stack.Screen name="EventsReminded" component={EventsRemindedScreen} />
        <Stack.Screen name="EventBegin" component={EventBeginScreen} />
        <Stack.Screen name="EventMatched" component={EventMatchedScreen} />
        <Stack.Screen
          name="Circles"
          component={CirclesScreen}
          initialParams={{fromNotification: false}}
        />
        <Stack.Screen name="ContactUs" component={ContactUsScreen} />
        <Stack.Screen name="QuestionsEvent" component={QuestionsEventScreen} />

        <Stack.Screen name="OnboardingOne" component={OnboardingOneScreen} />
        <Stack.Screen name="OnboardingTwo" component={OnboardingTwoScreen} />
        <Stack.Screen
          name="OnboardingThree"
          component={OnboardingThreeScreen}
        />
        <Stack.Screen name="OnboardingFour" component={OnboardingFourScreen} />
        {/* <Stack.Screen name="KeepMePosted" component={KeepMePostedScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

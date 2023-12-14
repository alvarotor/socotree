import React, {useEffect, useContext, useState} from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {Alert, TouchableHighlight} from 'react-native';
import {checkMyCircles, checkCircle, unblockProfile} from '../../core';
import {
  SafeAreaViewWrapper,
  Body,
  ListSection,
  ListText,
  CrossIconStyled,
} from '../components/GlobalStyles';
import {List, CrossIconContainerStyled} from './styled';
import {UserContext} from '../UserContext';
import {AppHeader} from '../components/app-header';
import {ScreenHeaderShape} from '../components/screen-header-shape';
import AsyncStorage from '@react-native-community/async-storage';
import {trackScreen} from '../segment';

export const BlockedUsersScreen = ({navigation}) => {
  const {user, setUser} = useContext(UserContext);
  const [blocked, setBlocked] = useState([]);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  useEffect(() => {
    trackScreen('BlockedUsers', user.userid);

    const getCircles = async () => {
      let users = [];
      console.log(user.blockedusers);
      const circlesAll = await checkMyCircles(user.token);
      await Promise.all(
        await circlesAll.map(async (circles) => {
          const circle = await checkCircle(user.token, circles.circleid);
          circle.map(async (u) => {
            // console.log('circle', u);
            delete u.user.blockedusers;
            delete u.user.userinterest;
            users.push({name: u.user.profile.name, id: u.userid});
          });
        }),
      );

      // console.log('users', users);

      let usersBlocked = [];

      if (user.blockedusers && user.blockedusers.length > 0) {
        for (let b = 0; b < user.blockedusers.length; b++) {
          const userFiltered = users.filter(
            (u) => u.id === user.blockedusers[b].userblockedid,
          );
          if (userFiltered.length > 0) {
            user.blockedusers[b].name = userFiltered[0].name;
            usersBlocked = [...usersBlocked, user.blockedusers[b]];
          }
        }
      }

      // console.log('usersBlocked', usersBlocked);

      setBlocked(usersBlocked);
    };

    getCircles();
  }, [user.token, user.blockedusers, user.userid]);

  const unBlockTheUser = async (profile) => {
    // console.log(user.blockedusers);
    // console.log(profile);
    if (await unblockProfile(profile, user.token)) {
      const updatedUser = {
        ...user,
        blockedusers: user.blockedusers.filter(
          (u) => u.userblockedid !== profile,
        ),
      };
      AsyncStorage.setItem('loginUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      navigation.pop();
    } else {
      Alert.alert(
        'Unblocking user',
        'Its not being possible to unblock that user, please try again.',
      );
    }
  };

  const confirmBlockedUser = (profile) => {
    Alert.alert('Do you want to unblock ?', '', [
      {text: 'Cancel'},
      {
        text: 'YES',
        onPress: () => unBlockTheUser(profile),
      },
    ]);
  };

  return (
    <SafeAreaViewWrapper>
      <AppHeader navigation={navigation} backgroundColor={'#f2fff2'} />
      <ScreenHeaderShape titleText={'Blocked Users'} />
      <Body>
        <ListSection>
          {blocked.map((u, i) => {
            return (
              <List key={i}>
                <ListText>{u.name}</ListText>
                <CrossIconContainerStyled>
                  <TouchableHighlight
                    underlayColor="#ffffff00"
                    onPress={() => confirmBlockedUser(u.userblockedid)}>
                    <CrossIconStyled name={'closecircle'} />
                  </TouchableHighlight>
                </CrossIconContainerStyled>
              </List>
            );
          })}
        </ListSection>
      </Body>
    </SafeAreaViewWrapper>
  );
};

BlockedUsersScreen.defaultProps = defaultProps;
BlockedUsersScreen.propTypes = propTypes;

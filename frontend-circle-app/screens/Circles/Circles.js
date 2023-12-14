import React, {useEffect, useState, useContext} from 'react';
import {defaultProps, propTypes} from '../components/props';
import {AppHeader} from '../components/app-header';
import {BottomTab} from '../components/botom-tab';
import {TitleText} from '../components/title-text';
import {
  MainViewWrapper,
  MainWrapper,
  ImageWrapper,
  NotYetText,
} from '../components/GlobalStyles';
import {
  ChatWrapper,
  ImageContainer,
  FriendsContainer,
  CountContainer,
  JoinContainer,
  TextContainer,
  NameContainer,
  ContainerWrapper,
  TitleView,
  ImageView,
  TextWrapper,
  ActivityIndicator,
  InnerViewUpper,
} from './styled';
import {FlatList} from 'react-native';
import {Template} from '../components/keyboard-safe-view';
import {UserContext} from '../UserContext';
import {messagesCircle, isUserBlocked} from '../../core';
import {getCirclesInfo, renderCircles} from './core';
import AsyncStorage from '@react-native-community/async-storage';

export const CirclesScreen = ({navigation, route}) => {
  const {user} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  const [myCircles, setMyCircles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getCircles = async () => {
      const circles = await getCirclesInfo(user.token);

      if (!isMounted) {
        return;
      }

      const showFakeDetails = false;
      const chatDetails = renderCircles(circles, user, showFakeDetails);
      // console.log('chatDetails', JSON.stringify(chatDetails));

      if (!showFakeDetails) {
        for (let i = 0; i < chatDetails.length; i++) {
          const c = chatDetails[i];
          // console.log('c', c);
          // console.log('c.circleid', c.circleid);
          if (c.circleid) {
            const messages = await messagesCircle(user.token, c.circleid);
            if (messages.length > 0) {
              const itemCircleName = 'circle-' + c.circleid;
              const lastTime = await AsyncStorage.getItem(itemCircleName);
              let count = 0;
              messages.map((message) => {
                if (
                  message.userid !== user.userid &&
                  message.created >= lastTime
                ) {
                  count++;
                }
              });
              c.count = count;
            }
          }
        }
      }

      setIsLoading(false);
      setMyCircles(chatDetails);
    };

    getCircles();

    return () => {
      isMounted = false;
    };
  }, [user.token, user]);

  const gotoCircle = (circle, event) => {
    // console.log(circle);
    navigation.navigate('Chat', {
      users: circle,
      event,
    });
  };

  const userItem = (image, index) => (
    <ImageContainer key={index}>
      <ImageWrapper source={image} />
    </ImageContainer>
  );

  const renderItem = (item, idx) => {
    return (
      <ContainerWrapper>
        <ChatWrapper onPress={() => gotoCircle(item.circle, item.title)}>
          <FriendsContainer>
            <JoinContainer
              flex={item.friends?.length <= 4 ? 0.25 : 0.33}
              onPress={() => gotoCircle(item.circle, item.title)}>
              {item.friends?.length <= 2 ? (
                <NameContainer>
                  {item.friends?.map((data, index) => {
                    if (
                      user.blockedusers &&
                      !isUserBlocked(user, data.userid)
                    ) {
                      return userItem(data.image, index);
                    }
                  })}
                </NameContainer>
              ) : (
                <ImageView>
                  <NameContainer>
                    {item.friends?.map((data, index) => {
                      if (
                        user.blockedusers &&
                        !isUserBlocked(user, data.userid)
                      ) {
                        if (index + 1 <= item.friends.length / 2) {
                          return userItem(data.image, index);
                        }
                      }
                    })}
                  </NameContainer>
                  <NameContainer>
                    {item.friends?.map((data, index) => {
                      if (
                        user.blockedusers &&
                        !isUserBlocked(user, data.userid)
                      ) {
                        if (index + 1 > item.friends.length / 2) {
                          return userItem(data.image, index);
                        }
                      }
                    })}
                  </NameContainer>
                </ImageView>
              )}
            </JoinContainer>
            <TextContainer
              onPress={() => gotoCircle(item.circle, item.title)}
              flex={
                item.friends?.length <= 4
                  ? item.count
                    ? 0.64
                    : 0.8
                  : item.count
                  ? 0.56
                  : 0.73
              }>
              <TitleText
                onPress={() => gotoCircle(item.circle, item.title)}
                title={true}
                text={item.title}
                fontSize={'20px'}
                color={'#05EA00'}
              />
              <TextWrapper onPress={() => gotoCircle(item.circle, item.title)}>
                {item.friends?.map((data, index) => {
                  // console.log(data);
                  if (
                    user.blockedusers &&
                    !isUserBlocked(user, data.userid) &&
                    data.name
                  ) {
                    return (
                      <TitleText
                        onPress={() => gotoCircle(item.circle, item.title)}
                        key={index}
                        title={false}
                        text={
                          data.name !== 'you.' ? data.name + ', ' : data.name
                        }
                        fontSize={'14px'}
                      />
                    );
                  }
                })}
              </TextWrapper>
            </TextContainer>
            {item.count ? (
              <CountContainer>
                <TitleText
                  title={false}
                  text={item.count.toString()}
                  fontSize={'16px'}
                  color={'white'}
                  textAlign={'center'}
                />
              </CountContainer>
            ) : null}
          </FriendsContainer>
        </ChatWrapper>
      </ContainerWrapper>
    );
  };

  return (
    <Template>
      <MainViewWrapper>
        <MainWrapper>
          <AppHeader
            navigation={navigation}
            backgroundColor={'#F2FFF2'}
            leftButton={{isHidden: true}}
          />
          <InnerViewUpper>
            <TitleView>
              <TitleText title={true} text="My circles" />
            </TitleView>
            <ActivityIndicator
              animating={isLoading}
              size="large"
              color={'#05EA00'}
            />
            {myCircles.length > 0 || isLoading ? (
              <FlatList
                data={myCircles}
                contentContainerStyle={{paddingBottom: 10}}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps={'handled'}
                keyExtractor={(item) => item.circleid}
                renderItem={({item, index}) => renderItem(item, index)}
              />
            ) : (
              <NotYetText>
                You have no chats yet. Take part in events to get matched into
                Circles and chat with other people.
              </NotYetText>
            )}
          </InnerViewUpper>
          <BottomTab isChat={true} navigation={navigation} />
        </MainWrapper>
      </MainViewWrapper>
    </Template>
  );
};

CirclesScreen.defaultProps = defaultProps;
CirclesScreen.propTypes = propTypes;

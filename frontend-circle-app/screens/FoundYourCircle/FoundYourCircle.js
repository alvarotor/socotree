import React, {useContext, useEffect} from 'react';
import {defaultProps, propTypes} from './props';
import {
  DescriptionWrapper,
  ButtonWrapper,
  TextWrapper,
  ImageOutMainWrapper,
  ImageWrapper,
  TextMainWrapper,
  CountWrapper,
  ImageContainer,
  // NightImageWrapper,
  // IconStyled,
  // IconStyled5,
  // IonStyled,
  // IconWrapper,
} from './styled';
import {TitleText} from '../components/title-text';
import {Button} from '../components/button';
import {ProfileImageBubble} from '../components/ProfileImageBubble';
import {View, ScrollView} from 'react-native';
import {
  MainViewWrapper,
  InnerView,
  InterestWrapper,
  Interest,
  // Separator,
} from '../components/GlobalStyles';
import Moment from 'moment';
import {trackScreen} from '../segment';
import {UserContext} from '../UserContext';

export const FoundYourCircleScreen = ({
  users,
  circles,
  navigation,
  onToggleFoundYourCirclesModal,
}) => {
  const {user} = useContext(UserContext);

  useEffect(() => {
    trackScreen('FoundYourCircle', user.userid);
  });

  const getAge = (u) => {
    var newDate = Moment.utc();
    newDate.set('year', u.ageyear);
    newDate.set('month', u.agemonth - 1);
    newDate.set('date', u.ageday);
    const dateString = Moment(newDate).format('YYYY-MM-DD');
    const birthAge = Moment().diff(dateString, 'years');
    return birthAge + ' years old';
  };

  const goToChatCircle = () => {
    onToggleFoundYourCirclesModal(false);
    navigation.navigate('Chat', {
      users,
      circles,
      comesFromFoundYourCircle: true,
    });
  };

  // const nightIconsArray = [
  //   {
  //     label: 'Alcohol',
  //     icon: 'cocktail',
  //     key: '23g',
  //     isSelected: true,
  //     list: 'FontAwesome5',
  //   },
  //   {
  //     label: 'Parks',
  //     icon: 'tree',
  //     key: 'vr4',
  //     isSelected: true,
  //     list: 'FontAwesome',
  //   },
  //   {
  //     label: 'TV',
  //     icon: 'tv',
  //     key: 'df34345345',
  //     isSelected: true,
  //     list: 'FontAwesome',
  //   },
  //   {
  //     label: 'Cinema',
  //     icon: 'film',
  //     key: 'df34',
  //     isSelected: true,
  //     list: 'FontAwesome',
  //   },
  //   {
  //     label: 'Marijuana',
  //     icon: 'cannabis',
  //     key: 'dfr3',
  //     isSelected: true,
  //     list: 'FontAwesome5',
  //   },
  //   {
  //     label: 'Sport',
  //     icon: 'trophy',
  //     key: 'dfr6',
  //     isSelected: true,
  //     list: 'FontAwesome',
  //   },
  //   {
  //     label: 'Culture',
  //     icon: 'theater-masks',
  //     key: 'dfr6dfgdfg',
  //     isSelected: true,
  //     list: 'FontAwesome5',
  //   },
  //   {
  //     label: 'Restaurant',
  //     icon: 'restaurant',
  //     key: 'dfr6et5tefg234234',
  //     isSelected: true,
  //     list: 'Ion',
  //   },
  //   {
  //     label: 'Music',
  //     icon: 'music',
  //     key: 'dfr6et5tefgsfsdf',
  //     isSelected: true,
  //     list: 'FontAwesome',
  //   },
  //   {
  //     label: 'Conversation',
  //     icon: 'comments',
  //     key: 'lsdfghsldg',
  //     isSelected: true,
  //     list: 'FontAwesome',
  //   },
  //   {
  //     label: 'Walk',
  //     icon: 'walk',
  //     key: 'adsufioas',
  //     isSelected: true,
  //     list: 'Ion',
  //   },
  //   {
  //     label: 'Shopping',
  //     icon: 'shopping-bag',
  //     key: 'adsufioasxcvxcv',
  //     isSelected: true,
  //     list: 'FontAwesome5',
  //   },
  // ];

  return (
    <MainViewWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageOutMainWrapper>
          <ProfileImageBubble icon={true} />
        </ImageOutMainWrapper>
        <InnerView>
          <TitleText
            title={true}
            fontSize={'40px'}
            text="We’ve found your circle!"
          />
          <DescriptionWrapper>
            <TitleText
              fontSize={'18px'}
              text={`After a strenious search we’ve found a circle for you! ${users.length} people with similar interests willing to connect now!`}
            />
          </DescriptionWrapper>
          <View>
            <TextWrapper>
              <TitleText fontSize={'15px'} text="MEET YOUR NEW FRIENDS" />
            </TextWrapper>
            {users &&
              users.map((u, index) => {
                return (
                  <View key={u.userid}>
                    <ImageContainer>
                      <ImageWrapper
                        source={{
                          uri: !u.user.profile.photo
                            ? 'https://i.vimeocdn.com/portrait/58832_300x300.jpg'
                            : u.user.profile.photo,
                        }}
                      />
                    </ImageContainer>
                    <TextMainWrapper>
                      <CountWrapper>
                        <TitleText
                          fontSize={'25px'}
                          text={(index + 1).toString()}
                          color="#fff"
                        />
                      </CountWrapper>
                      <View>
                        <TitleText
                          fontSize={'22px'}
                          text={u.user.profile.name}
                          color="#000"
                        />
                        <TitleText
                          fontSize={'14px'}
                          text={getAge(u.user.profile)}
                          color="rgba(0, 0, 0, 0.45)"
                        />
                      </View>
                    </TextMainWrapper>
                    {/* <TextWrapper>
                      <TitleText
                        fontSize={'15px'}
                        text="PERFECT NIGHT WOULD INCLUDE"
                      />
                    </TextWrapper>
                    <NightImageWrapper>
                      {nightIconsArray.map((item) => {
                        return (
                          <IconWrapper
                            key={item.key}
                            background={item.isSelected ? 'black' : '#7A7A7A'}>
                            {item.list === 'FontAwesome' ? (
                              <IconStyled name={item.icon} />
                            ) : item.list === 'FontAwesome5' ? (
                              <IconStyled5 name={item.icon} />
                            ) : (
                              <IonStyled name={item.icon} />
                            )}
                          </IconWrapper>
                        );
                      })}
                    </NightImageWrapper> */}
                    {/* <Separator /> */}
                    <InterestWrapper>
                      {u.user &&
                        u.user.userinterest &&
                        u.user.userinterest.map((i) => {
                          return (
                            <Interest key={i.interestid}>
                              <TitleText
                                fontSize={'15px'}
                                text={i.interest.name}
                                color="#fff"
                              />
                            </Interest>
                          );
                        })}
                    </InterestWrapper>
                  </View>
                );
              })}
          </View>
          <ButtonWrapper>
            <Button
              buttonText="Go to Chat Circle"
              onPress={() => goToChatCircle()}
            />
          </ButtonWrapper>
        </InnerView>
      </ScrollView>
    </MainViewWrapper>
  );
};

FoundYourCircleScreen.defaultProps = defaultProps;
FoundYourCircleScreen.propTypes = propTypes;

import React, {useState, useContext, useEffect} from 'react';
import {FlatList, TouchableWithoutFeedback} from 'react-native';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {AppHeader} from '../components/app-header';
import {TitleText} from '../components/title-text';
import {Button} from '../components/button';
import {
  InputFieldWrapper,
  MainViewWrapper,
  InnerView,
  ButtonWrapper,
} from '../components/GlobalStyles';
import {
  BoxCellContainer,
  IconStyled,
  IconStyled5,
  IonStyled,
  ListSection,
} from './styled';
import {UserContext} from '../UserContext';
import {trackScreen} from '../segment';

const sampleDataArray = [
  {
    label: 'Alcohol',
    icon: 'cocktail',
    key: '23g',
    isSelected: false,
    list: 'FontAwesome5',
  },
  {
    label: 'Parks',
    icon: 'tree',
    key: 'vr4',
    isSelected: false,
    list: 'FontAwesome',
  },
  {
    label: 'TV',
    icon: 'tv',
    key: 'df34',
    isSelected: false,
    list: 'FontAwesome',
  },
  {
    label: 'Cinema',
    icon: 'film',
    key: 'df34asasdasd',
    isSelected: false,
    list: 'FontAwesome',
  },
  {
    label: 'Marijuana',
    icon: 'cannabis',
    key: 'dfr3',
    isSelected: false,
    list: 'FontAwesome5',
  },
  {
    label: 'Sport',
    icon: 'trophy',
    key: 'dfr6',
    isSelected: false,
    list: 'FontAwesome',
  },
  {
    label: 'Culture',
    icon: 'theater-masks',
    key: 'dfr6dfgdfg',
    isSelected: false,
    list: 'FontAwesome5',
  },
  {
    label: 'Restaurant',
    icon: 'restaurant',
    key: 'dfr6et5tefgasdas',
    isSelected: false,
    list: 'Ion',
  },
  {
    label: 'Music',
    icon: 'music',
    key: 'dfr6et5tefg',
    isSelected: false,
    list: 'FontAwesome',
  },
  {
    label: 'Conversation',
    icon: 'comments',
    key: 'lsdfghsldg',
    isSelected: false,
    list: 'FontAwesome',
  },
  {
    label: 'Walk',
    icon: 'walk',
    key: 'adsufioas',
    isSelected: false,
    list: 'Ion',
  },
  {
    label: 'Shopping',
    icon: 'shopping-bag',
    key: 'adsufioasasdasd',
    isSelected: false,
    list: 'FontAwesome5',
  },
];

export const PerfectEveningScreen = ({navigation}) => {
  const {user} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  const [activites, setActivites] = useState([...sampleDataArray]);

  useEffect(() => {
    trackScreen('PerfectEvening', user.userid);
  });

  const selectActivity = (isSelected, index) => {
    let modActivities = [...activites];
    modActivities[index].isSelected = !isSelected;
    setActivites(modActivities);
  };

  const onPressContinue = () => {
    console.log(activites.filter((act) => act.isSelected));
    navigation.navigate('EditProfile');
  };

  const renderTitle = () => {
    return (
      <InputFieldWrapper>
        <TitleText
          title={true}
          text="What would a perfect evening include?"
          fontSize={'40px'}
        />
      </InputFieldWrapper>
    );
  };

  const renderGridItem = (item, index) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => selectActivity(item.isSelected, index)}>
        <BoxCellContainer
          marginStyle={index % 2 !== 0 ? 15 : 0}
          background={item.isSelected ? '#010101' : '#F0F0F0'}>
          {item.list === 'FontAwesome' ? (
            <IconStyled
              name={item.icon}
              color={item.isSelected ? '#F0F0F0' : '#010101'}
            />
          ) : item.list === 'FontAwesome5' ? (
            <IconStyled5
              name={item.icon}
              color={item.isSelected ? '#F0F0F0' : '#010101'}
            />
          ) : (
            <IonStyled
              name={item.icon}
              color={item.isSelected ? '#F0F0F0' : '#010101'}
            />
          )}
          <TitleText
            text={item.label}
            fontSize={'18px'}
            color={item.isSelected ? '#F0F0F0' : '#010101'}
          />
        </BoxCellContainer>
      </TouchableWithoutFeedback>
    );
  };

  const renderGrid = () => {
    return (
      <ListSection>
        <FlatList
          numColumns={2}
          data={activites}
          renderItem={({item, index, separators}) =>
            renderGridItem(item, index)
          }
          keyExtractor={(item) => item.key}
        />
      </ListSection>
    );
  };

  return (
    <MainViewWrapper>
      <AppHeader navigation={navigation} />
      <InnerView>
        {renderTitle()}
        {renderGrid()}
        <ButtonWrapper>
          <Button buttonText="Continue" onPress={() => onPressContinue()} />
        </ButtonWrapper>
      </InnerView>
    </MainViewWrapper>
  );
};

PerfectEveningScreen.defaultProps = defaultProps;
PerfectEveningScreen.propTypes = propTypes;

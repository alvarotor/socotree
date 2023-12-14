import React, {useState, useEffect, useContext} from 'react';
import {defaultProps, propTypes} from '../components/props';
import {AppHeader} from '../components/app-header';
import {TitleText} from '../components/title-text';
import {Button} from '../components/button';
import {
  MainViewWrapper,
  ButtonWrapper,
  InnerView,
  GrayBar,
  GreenBar,
} from '../components/GlobalStyles';
import {
  InnerWrapper,
  DisplayText,
  AddButtonWrapper,
  AddButton,
  TapText,
  InputFieldWrapper,
} from './styled';
import {FlatList, Alert, Keyboard} from 'react-native';
import {Template} from '../components/keyboard-safe-view';
import {
  interests as iRead,
  createUserInterests,
  deleteUserInterests,
  updateUserData,
} from '../../core';
import ENV from '../../active.env';
import SearchableDropdown from '../components/search';
import {UserContext} from '../UserContext';
import {identify, trackScreen} from '../segment';

export const InterestsScreen = ({navigation, route}) => {
  const {settings} = route.params;
  const {user, setUser} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  useEffect(() => {
    trackScreen('Interests', user.userid);
  });

  const capitalizeFirst = (string) => {
    string = string.trim();
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const [interest, setInterest] = useState();
  const [data, setData] = useState([]);
  const [numberItemsFound, setNumberItemsFound] = useState(0);
  const [selectedData, setSelectedData] = useState(
    user.userinterest
      .filter((i) => i.interest.name)
      .map((i) => {
        return {
          name: capitalizeFirst(i.interest.name),
          uuid: i.interestid,
          id: i.interestid,
        };
      }),
  );

  useEffect(() => {
    const getInterests = async () => {
      // Filter data for verified interests and not verified interests created this user
      let filteredData = (await iRead()).filter((item) => {
        if (item.adminverified) {
          return true;
        } else {
          let addedByUserItem = selectedData.find(
            (selectedItem) => selectedItem.uuid === item.uuid,
          );
          return !!addedByUserItem;
        }
      });

      // Modify data for search component
      setData(
        filteredData.map((item) => ({
          ...item,
          name: capitalizeFirst(item.name),
          id: item.uuid,
        })),
      );
    };

    getInterests();
  }, [user.userinterest, selectedData]);

  const addInterest = () => {
    if (
      interest.trim() !== '' &&
      selectedData.filter((item) => item.name === interest).length === 0
    ) {
      const modSelected = [...selectedData];
      const newInterest = {
        name: '' + interest.trim().replace(/ +(?= )/g, ''),
        id: data.length.toString(),
      };

      modSelected.push(newInterest);
      setSelectedData(modSelected);
      setData([newInterest, ...data]);
    }
    setInterest('');
  };

  const onSearchTextChange = (text, listLength) => {
    setInterest(text);
    setNumberItemsFound(listLength);
  };

  const onPressContinue = async () => {
    if (selectedData.length < 3 && ENV !== 'dev') {
      Alert.alert(
        'Interests',
        'You must add at least 3 interests, and you can add ones that does not exist too yet.',
      );
      return;
    }

    if (!(await deleteUserInterests(user.token))) {
      Alert.alert(
        'Interests',
        'There was a problem cleaning your old interests, please try again.',
      );
      return;
    }

    if (
      !(await createUserInterests(
        user.token,
        JSON.stringify(
          selectedData.map((item) => ({
            InterestID: item.uuid ? item.uuid : item.name,
          })),
        ).replace(/"/g, "'"),
      ))
    ) {
      Alert.alert(
        'Interest',
        'There was a problem saving your interests, please try again.',
      );
      return;
    }

    let newInterestFound =
      selectedData.filter((item) => !item.uuid).length !== 0;
    let dataReSaved;
    if (newInterestFound) {
      dataReSaved = await iRead();
    } else {
      dataReSaved = data;
    }

    user.userinterest = selectedData.map((item) => {
      let uuid = item.uuid;

      if (!uuid) {
        let newItem = dataReSaved.find(
          (dataItem) => item.name === dataItem.name,
        );
        if (newItem) {
          uuid = newItem.uuid;
        }
      }

      return {
        interest: {name: item.name},
        interestid: uuid,
      };
    });

    const updatedUser = {
      ...user,
      profile: await updateUserData(user),
    };
    setUser(updatedUser);
    await identify(user.userid, user.email, updatedUser.profile);
    if (settings) {
      navigation.navigate('EditProfile', {
        user,
      });
    } else {
      Keyboard.dismiss();
      navigation.navigate('Questions', {
        user,
      });
    }
  };

  const showAddButton =
    interest &&
    interest.trim().length > 3 &&
    '' + interest.trim().replace(/ +(?= )/g, '').length > 3 &&
    interest.trim().length < 26 &&
    data.filter(
      (item) => '' + interest.trim().replace(/ +(?= )/g, '') === item.name,
    ).length === 0 &&
    numberItemsFound === 0;

  const renderSearchableDropdown = () => (
    <SearchableDropdown
      multi={true}
      selectedItems={selectedData}
      onItemSelect={(item) => {
        const selectedItems = [...selectedData];
        selectedItems.push(item);
        setSelectedData(selectedItems);
      }}
      containerStyle={{flex: 1, padding: 5}}
      onRemoveItem={(item) => {
        const selectedItems = selectedData.filter(
          (sItem) => sItem.id !== item.id,
        );
        setSelectedData(selectedItems);
      }}
      onTextChange={onSearchTextChange}
      itemStyle={{
        padding: 5,
        marginTop: 5,
        marginBottom: 3,
      }}
      items={data}
      resetValue={true}
      textInputProps={{
        placeholder: 'Search or add them here...',
        placeholderTextColor: 'grey',
        underlineColorAndroid: 'transparent',
        autoFocus: false,
        style: {
          flex: 1,
          // selfAlign: 'right',
          paddingHorizontal: 10,
          fontFamily: 'Roboto-Regular',
          fontSize: 20,
        },
      }}
      listProps={{
        orientation: 'vertical',
        nestedScrollEnabled: true,
      }}
    />
  );

  const renderTextFields = () => {
    return (
      <InputFieldWrapper>
        <TitleText
          title={true}
          text="What are your interests?"
          fontSize={'40px'}
        />
        <TapText>
          <TitleText
            text="The more and specific interests you select or add, the better people can find you. One interest at a time."
            fontSize={'15px'}
          />
        </TapText>
        <InnerWrapper>{renderSearchableDropdown()}</InnerWrapper>
      </InputFieldWrapper>
    );
  };

  const AddInterestButton = () => (
    <AddButtonWrapper>
      <AddButton onPress={() => addInterest()}>
        <DisplayText color={'#fff'}>Add</DisplayText>
      </AddButton>
    </AddButtonWrapper>
  );

  return (
    <Template>
      <MainViewWrapper>
        {!settings ? (
          <GrayBar>
            <GreenBar width={(100 / 6) * 4} />
          </GrayBar>
        ) : null}
        <AppHeader navigation={navigation} />
        <InnerView>
          <FlatList
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps={'handled'}
            ListHeaderComponent={renderTextFields()}
            ListFooterComponent={showAddButton ? <AddInterestButton /> : null}
          />
          <ButtonWrapper>
            <Button buttonText="Continue" onPress={() => onPressContinue()} />
          </ButtonWrapper>
        </InnerView>
      </MainViewWrapper>
    </Template>
  );
};

InterestsScreen.defaultProps = defaultProps;
InterestsScreen.propTypes = propTypes;

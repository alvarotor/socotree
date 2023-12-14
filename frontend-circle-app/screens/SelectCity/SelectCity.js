import React, {useState} from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {Alert} from 'react-native';
import {
  InnerGreenViewUpper,
  MainViewUpper,
  CenterImage,
  InnerViewUpper,
  PickerWrapper,
  IconStyled,
} from './styled';
import {Button} from '../components/button';
import {BlackLogo} from '../components/black-logo';
import {TextWrapper, ButtonWrapper, Triangle} from '../components/GlobalStyles';
import {SelectCityPopup} from './SelectCityPopup';
import {TitleText} from '../components/title-text';
import SKY_CIRCLE_IMG from '../components/images/sky_center_img.png';
import AsyncStorage from '@react-native-community/async-storage';

export const SelectCityScreen = ({navigation}) => {
  const [pickerOptions] = useState([
    {title: 'Choose your city', id: 1, isSelected: true},
    {title: 'Berlin', id: 2, isSelected: true},
    {title: 'Other', id: 3, isSelected: true},
  ]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [popVisibility, setPopVisibility] = useState(false);

  const onSelectOption = (obj) => {
    if (obj.id === 3) {
      setSelectedOption(obj);
    } else {
      setPopVisibility(false);
      setSelectedOption(obj);
    }
  };

  const onCancelSelection = () => {
    if (selectedOption && selectedOption.id === 3) {
      setSelectedOption(null);
    } else {
      setPopVisibility(false);
    }
  };

  return (
    <MainViewUpper>
      <MainViewUpper>
        <InnerGreenViewUpper>
          <BlackLogo backBtn={false} />
        </InnerGreenViewUpper>
        <Triangle />
        <InnerViewUpper>
          <CenterImage source={SKY_CIRCLE_IMG} />
          <TextWrapper fontSize={'22px'}>
            <TitleText fontSize={'22px'} text={'Hi!'} color="#000" />
          </TextWrapper>
          <TitleText
            fontSize={'22px'}
            text={'Where do you live?'}
            color="#000"
          />
          <PickerWrapper
            onPress={() => {
              setPopVisibility(true);
            }}>
            <TextWrapper fontSize={'18px'}>
              <TitleText
                fontSize={'18px'}
                text={
                  selectedOption ? selectedOption.title : 'Choose your city'
                }
                color="#000"
                onPress={() => {
                  setPopVisibility(true);
                }}
              />
            </TextWrapper>
            <IconStyled name="down" />
          </PickerWrapper>
          <ButtonWrapper>
            <Button
              buttonText="Next"
              textColor={'#000'}
              onPress={async () => {
                if (selectedOption && selectedOption.id === 2) {
                  await AsyncStorage.setItem(
                    'selectedCity',
                    selectedOption.title,
                  );
                  navigation.navigate('OnboardingOne');
                } else {
                  Alert.alert('City', 'Please select your city');
                }
              }}
            />
          </ButtonWrapper>
        </InnerViewUpper>
        <SelectCityPopup
          isVisible={popVisibility}
          pickerOptions={pickerOptions}
          onSelect={onSelectOption}
          selectedOption={selectedOption}
          setPopVisibility={setPopVisibility}
          onCancelSelection={onCancelSelection}
        />
      </MainViewUpper>
    </MainViewUpper>
  );
};

SelectCityScreen.defaultProps = defaultProps;
SelectCityScreen.propTypes = propTypes;

import React from 'react';
import {Modal} from 'react-native';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {ButtonWrapper, TextWrapper} from '../components/GlobalStyles';
import {Button} from '../components/button';
import {ModalViewWrapper} from '../components/GlobalStyles';
import {
  InnerViewUpper,
  OptionsWrapper,
  Option,
  Separator,
  GotItWrapper,
} from './styled';
import {TitleText} from '../components/title-text';

export const SelectCityPopup = ({
  pickerOptions,
  onSelect,
  isVisible,
  selectedOption,
  onCancelSelection,
}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <ModalViewWrapper>
        <InnerViewUpper>
          <OptionsWrapper>
            {(!selectedOption || selectedOption.id !== 3) &&
              pickerOptions.map((obj, index) => {
                return (
                  <Option key={index} onPress={() => onSelect(obj)}>
                    <TitleText
                      fontSize={'16px'}
                      text={obj.title}
                      onPress={() => {
                        onSelect(obj);
                      }}
                      color={index > 0 ? '#0047FF' : '#000'}
                    />
                    {index < 2 && <Separator />}
                  </Option>
                );
              })}
            {selectedOption && selectedOption.id === 3 && (
              <GotItWrapper>
                <TextWrapper fontSize={'0px'}>
                  <TitleText fontSize={'24px'} text={'Sorry'} color="#000" />
                </TextWrapper>
                <TitleText
                  fontSize={'18px'}
                  text={
                    'Unfortunately Circles is only available in Berlin right now. \n \nWe are working hard on making the app available for other regions as well. Stay tuned!'
                  }
                  color="#000"
                />
              </GotItWrapper>
            )}
          </OptionsWrapper>
          <ButtonWrapper>
            <Button
              textColor={'#000'}
              buttonText={
                selectedOption && selectedOption.id === 3 ? 'Got it' : 'Cancel'
              }
              onPress={() => onCancelSelection()}
            />
          </ButtonWrapper>
        </InnerViewUpper>
      </ModalViewWrapper>
    </Modal>
  );
};

SelectCityPopup.defaultProps = defaultProps;
SelectCityPopup.propTypes = propTypes;

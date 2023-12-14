import React from 'react';
import {defaultProps, propTypes} from './props';
import {
  ContainerWrapper,
  ReminderWrapper,
  DescText,
  ImpWrapper,
  ImpText,
  Exclamation,
  UnderlineText,
  NormalText,
  ContainerView,
  RedButtonView,
} from './styled';
import {
  ModalViewWrapper,
  ButtonWrapper,
  ButtonDoubleWrapper,
  GreenButtonFilledView,
  ButtonGreenFilledText,
} from '../../components/GlobalStyles';
import {Modal, StatusBar} from 'react-native';
import {Button} from '../button';
import {InnerView} from '../../components/GlobalStyles';
import {TitleText} from '../title-text';

export const ImportantPopUp = ({isVisible, hideModal, type, leaveEvent}) => {
  let title, description1, description2, description3;
  // console.log(type);
  switch (type) {
    case '0':
      title = 'You can’t join yet';
      description1 = 'The event is not opened to join yet.';
      description2 =
        '3 hours before the event starts, it will be opened to join.';
      description3 = 'BEFORE it starts to take part';
      break;
    case '1':
      title = 'The event hasn’t started yet.';
      description1 = 'You will get matched when the event starts.';
      description2 = 'Please wait a moment for the event to begin.';
      description3 = 'BEFORE it starts to take part';
      break;
    case '2':
      title = 'Are you sure that you want to leave the event?';
      description1 =
        "You won't be able to take part in the event if you leave.";
      description2 = '';
      description3 = '';
      break;
    default:
      break;
  }

  return (
    <>
      {isVisible ? <StatusBar backgroundColor={'rgba(0, 0, 0, 0.72)'} /> : null}
      <Modal animationType="fade" transparent={true} visible={isVisible}>
        <ModalViewWrapper>
          <InnerView>
            <ContainerView>
              <ContainerWrapper>
                <ReminderWrapper>
                  <TitleText title={true} text={title} fontSize={'24px'} />
                </ReminderWrapper>
                <DescText>{description1}</DescText>
                <DescText>{description2}</DescText>
                {type === '0' ? (
                  <ImpWrapper>
                    <ReminderWrapper>
                      <ImpText>IMPORTANT</ImpText>
                      <Exclamation name={'exclamation'} />
                      <Exclamation name={'exclamation'} />
                      <Exclamation name={'exclamation'} />
                    </ReminderWrapper>
                    <NormalText>You need to join the event</NormalText>
                    <UnderlineText>{description3}</UnderlineText>
                  </ImpWrapper>
                ) : null}
              </ContainerWrapper>
              {type === '2' ? (
                <ButtonDoubleWrapper>
                  <GreenButtonFilledView onPress={() => hideModal()}>
                    <ButtonGreenFilledText>Stay</ButtonGreenFilledText>
                  </GreenButtonFilledView>
                  <RedButtonView onPress={() => leaveEvent()}>
                    <ButtonGreenFilledText>
                      Leave the event
                    </ButtonGreenFilledText>
                  </RedButtonView>
                </ButtonDoubleWrapper>
              ) : (
                <ButtonWrapper>
                  <Button
                    buttonText="I understand"
                    onPress={() => hideModal()}
                  />
                </ButtonWrapper>
              )}
            </ContainerView>
          </InnerView>
        </ModalViewWrapper>
      </Modal>
    </>
  );
};

ImportantPopUp.defaultProps = defaultProps;
ImportantPopUp.propTypes = propTypes;

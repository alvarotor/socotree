import React from 'react';
import {defaultProps, propTypes} from './props';
import {Modal} from 'react-native';
import {InterestWrapper, InterestSmall} from '../components/GlobalStyles';
import {TitleText} from '../components/title-text';
import {
  ModalViewWrapper,
  CrossButtonWrapper,
  ImageContainer,
  ImageWrapper,
  InterestContainer,
  ModalInnerViewWrapper,
  ImageTextRow,
  CrossWhiteIconStyled,
} from './styled';

export const InterestPopup = ({isVisible, onPressCross, users}) => {
  // console.log('users', users);
  return (
    <Modal animationType="fade" visible={isVisible} transparent>
      <ModalViewWrapper>
        <CrossButtonWrapper onPress={onPressCross}>
          <CrossWhiteIconStyled name={'closecircle'} />
        </CrossButtonWrapper>
        {users.map((u) => {
          // console.log(u);
          return (
            <ModalInnerViewWrapper key={u.userid}>
              <ImageTextRow>
                <ImageContainer>
                  <ImageWrapper
                    source={
                      u.user.profile.photo
                        ? {
                            uri: u.user.profile.photo,
                          }
                        : require('../components/images/test.jpg')
                    }
                  />
                </ImageContainer>
                <TitleText
                  title={true}
                  text={u.user.profile.name}
                  fontSize={'16px'}
                />
              </ImageTextRow>
              <InterestContainer>
                <InterestWrapper>
                  {u.user.userinterest.map((interest) => {
                    // console.log(interest);
                    if (interest.interest.name) {
                      return (
                        <InterestSmall key={interest.interestid}>
                          <TitleText
                            fontSize="12px"
                            text={interest.interest.name}
                            color="#fff"
                          />
                        </InterestSmall>
                      );
                    }
                  })}
                </InterestWrapper>
              </InterestContainer>
            </ModalInnerViewWrapper>
          );
        })}
      </ModalViewWrapper>
    </Modal>
  );
};

InterestPopup.defaultProps = defaultProps;
InterestPopup.propTypes = propTypes;

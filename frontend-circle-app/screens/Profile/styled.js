import styled from 'styled-components/native';

export const ProfileImageWrapper = styled.View`
  width: 130px;
  height: 130px;
  top: 15%;
  left: 15px;
  position: absolute;
  z-index: 4;
`;

export const ProfileImage = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 50px;
`;

export const EditImageWrapper = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  position: absolute;
  background: black;
  justify-content: center;
  align-items: center;
  right: -5px;
  border-radius: 24px;
  top: 70px;
  z-index: 9;
`;

export const GreenButtonView = styled.TouchableOpacity`
  height: 50px;
  background: #05ea00;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

export const ButtonWrapper = styled.View`
  width: 100%;
  margin-bottom: 15px;
  padding-horizontal: 20px;
`;

export const ButtonText = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 18px;
  align-self: center;
  color: #fff;
`;

export const CameraImage = styled.Image`
  width: 22px;
  height: 15px;
`;

export const ContentWrapper = styled.View`
  padding-top: 50px;
`;

export const SafeAreaViewWrapperBottom = styled.SafeAreaView`
  flex: 1;
`;

import styled from 'styled-components/native';
import {Dimensions} from '../../theme/Dimensions';

export const MainViewWrapper = styled.View`
  flex: 1;
`;

export const MainImage = styled.Image`
  width: 100%;
  height: 110%;
`;

export const ContentWrapper = styled.View`
  position: absolute;
  bottom: 15px;
  width: 100%;
`;

export const ContentContainer = styled.View`
  width: 95%;
  align-self: center;
`;

export const DiscoveredText = styled.Text`
  color: #fff;
  margin-bottom: ${Dimensions.DeviceHeight / 35}px;
  font-size: ${Dimensions.DeviceHeight / 12}px;
  font-family: 'Roboto-Bold';
  line-height: 80px;
  padding: 20px;
  width: ${Dimensions.DeviceWidth - 50}px;
`;

export const SignupText = styled.Text`
  font-family: 'Roboto-Regular';
  color: #fff;
  font-size: 16px;
`;

export const SignupButton = styled.TouchableOpacity`
  color: white;
  font-size: 16px;
`;

export const ButtonWrapper = styled.View`
  height: 50px;
  width: 100%;
  position: absolute;
  bottom: 0px;
`;

export const ImageWrapper = styled.TouchableOpacity`
  height: 26px;
  width: 26px;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  background: rgba(1, 1, 1, 0.45);
  border-radius: 2px;
  padding-right: 4px;
  padding-bottom: 4px;
`;

export const ImageOut = styled.View`
  height: 16px;
  width: 12px;
  margin-left: 5px;
`;

export const Image = styled.Image`
  height: 100%;
  width: 100%;
`;

export const CheckboxWrapper = styled.View`
  flex-direction: row;
  flex: 1;
  margin-top: 30px;
`;

export const AgreementTextWrapper = styled.View`
  flex: 1;
`;

export const BottomText = styled.Text`
  font-family: 'Roboto-Regular';
  color: white;
  font-size: 12px;
  text-align: center;
  font-weight: 500;
  line-height: 16px;
`;

export const TermsText = styled.Text`
  font-family: 'Roboto-Regular';
  color: white;
  font-size: 13px;
  text-align: center;
  font-weight: bold;
  line-height: 16px;
`;

export const TermsWrapper = styled.View`
  flex-direction: row;
  margin-top: 5px;
  justify-content: center;
  align-items: center;
`;

export const ButtonViewWrapper = styled.TouchableOpacity`
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  margin-bottom: 20px;
  background-color: transparent;
  border-color: #ccc;
  border-width: 1.5px;
`;

export const LogoImage = styled.Image`
  width: 160px;
  height: 40px;
  top: 30px;
  align-self: center;
  position: absolute;
`;

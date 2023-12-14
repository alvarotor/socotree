import styled from 'styled-components/native';
import {Dimensions} from 'react-native';

export const InnerWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const TapText = styled.View`
  margin-vertical: 25px;
`;

export const ImageContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  margin-right: 20px;
`;

export const ConnectText = styled.Text`
  font-family: 'Roboto-Regular';
  color: black;
  font-size: 16px;
  line-height: 24px;
  width: ${Dimensions.get('window').width / 1.3}px;
`;

export const SubTitleText = styled.Text`
  font-weight: bold;
  color: black;
  font-size: 12px;
  letter-spacing: 2px;
`;

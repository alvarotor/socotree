import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Platform} from 'react-native';

export const ConnectText = styled.Text`
  font-family: 'Roboto-Regular';
  color: black;
  font-size: 24px;
  line-height: 36px;
  margin-top: 30px;
`;

export const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
`;

export const IconStyled = styled(Icon)`
  font-size: 22px;
  font-weight: 700;
  color: #2ec229;
  margin-left: 5px;
`;

export const SubTitleText = styled.Text`
  font-weight: bold;
  color: black;
  font-size: 18px;
  letter-spacing: 1px;
  line-height: 27px;
`;

export const RedButtonView = styled.TouchableOpacity`
  flex: 1;
  height: 48px;
  background-color: #ff541e;
  margin-left: 10px;
  margin-right: 5px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

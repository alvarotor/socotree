import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';

export const IconStyled = styled(Icon)`
  font-size: 30px;
  font-weight: 700;
  color: black;
`;

export const MainViewWrapper = styled.View`
  width: 100%;
  background-color: #f2fff2;
`;

export const ContentWrapper = styled.View`
  margin-top: 10px;
  padding-horizontal: 15px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 68px;
`;

export const ButtonWrapper = styled.TouchableOpacity`
  height: 35px;
  width: 35px;
  position: absolute;
  left: 15px;
`;

export const LogoImage = styled.Image`
  height: 42px;
  width: 80%;
  resize-mode: contain;
`;

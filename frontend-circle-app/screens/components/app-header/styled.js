import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconEntypo from 'react-native-vector-icons/Entypo';
import {STATUSBAR_HEIGHT} from '../statusBar';

export const IconStyled = styled(Icon)`
  font-size: 30px;
  font-weight: 700;
  color: black;
`;

export const IconEntypoStyled = styled(IconEntypo)`
  font-size: 25px;
  font-weight: 500;
  color: black;
`;

export const MainViewWrapper = styled.View`
  width: 100%;
  background-color: #f2fff2;
`;

export const MainViewWrapperMain = styled.View`
  width: 100%;
`;

export const StatusBarWrapper = styled.View`
  position: absolute;
  width: 100%;
  top: -${STATUSBAR_HEIGHT}px;
`;

export const ContentWrapper = styled.View`
  margin-top: 0px;
  padding-horizontal: 15px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderText = styled.Text`
  margin-top: 12px;
  margin-bottom: 12px;
  font-size: 20px;
  align-self: center;
  letter-spacing: 3px;
  font-family: 'Roboto-Bold';
`;

export const ImageWrapperOut = styled.TouchableOpacity`
  height: 35px;
  width: 35px;
  border-radius: 20px;
`;

export const ImageWrapperProfile = styled.Image`
  height: 35px;
  width: 35px;
  border-radius: 20px;
`;

export const ButtonWrapper = styled.TouchableOpacity`
  height: 35px;
  width: 35px;
`;

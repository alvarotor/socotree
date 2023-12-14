import styled from 'styled-components/native';
import {STATUSBAR_HEIGHT} from '../components/statusBar';
import Icon from 'react-native-vector-icons/AntDesign';
import {Dimensions} from 'react-native';

export const TitleView = styled.View`
  height: 8%;
  align-items: center;
  background-color: #f2fef2;
  flex-direction: row;
  margin-top: -${STATUSBAR_HEIGHT}px;
  padding-left: 3%;
`;

export const InnerViewUpper = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 85px;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  padding-horizontal: 15px;
  padding-bottom: 20px;
`;
export const MainViewUpper = styled.View`
  flex: 1;
  width: 100%;
  background-color: white;
`;

export const InnerGreenViewUpper = styled.View`
  flex: 0.5;
  width: 100%;
  background-color: #f2fff2;
  padding-top: 20px;
`;

export const CenterImage = styled.Image`
  flex: 1;
  width: ${Dimensions.get('window').width}px;
  resize-mode: contain;
  margin-bottom: 20px;
`;

export const InnerImage = styled.Image`
  height: 200px;
  width: 40px;
`;

export const DescText = styled.Text`
  font-family: 'Roboto-Regular';
  color: black;
  font-size: 18px;
  line-height: 27px;
  text-align: center;
  margin-top: 5px;
`;

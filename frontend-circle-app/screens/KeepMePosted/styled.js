import styled from 'styled-components/native';
import {STATUSBAR_HEIGHT} from '../components/statusBar';
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
  flex: 1;
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
  height: 243px;
  width: ${Dimensions.get('window').width}px;
  position: absolute;
  z-index: 999;
  top: 147px;
  resize-mode: contain;
`;

export const DescText = styled.Text`
  font-family: 'Roboto-Bold';
  color: #6b6b6b;
  font-size: 18px;
  line-height: 27px;
  text-align: center;
  margin-bottom: 20px;
`;

export const SubText = styled.Text`
  font-family: 'Roboto-Bold';
  font-weight: 400;
  color: #000000;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  margin-bottom: 87px;
`;

export const MainText = styled.Text`
  font-family: 'Roboto-Bold';
  font-weight: 700;
  color: #000000;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  margin-bottom: 10px;
`;

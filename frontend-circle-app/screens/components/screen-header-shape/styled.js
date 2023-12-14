import styled from 'styled-components/native';
import {Dimensions} from 'react-native';

export const Triangle = styled.View`
  width: 0;
  height: 0;
  background-color: transparent;
  border-style: solid;
  border-left-width: ${Dimensions.get('window').width}px;
  border-top-width: 44px;
  border-left-color: transparent;
  border-top-color: #f2fff2;
`;

export const HeaderContent = styled.View`
  padding-left: 15px;
  padding-right: 15px;
  background-color: #f2fff2;
  padding-bottom: 50px;
`;

export const TitleTextStyle = styled.Text`
  font-family: 'Roboto-Bold';
  font-size: 30px;
`;

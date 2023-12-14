import styled from 'styled-components/native';
import {Dimensions} from 'react-native';
const windowHight = Dimensions.get('window').height;

export const SliderRowWrapper = styled.View`
  flex-direction: row;
  margin-vertical: ${windowHight < 700 ? '5px' : '20px'};
`;

export const GreenCircle = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  border-width: 1px;
  margin: 8px;
  border-color: #05ea00;
  text-align: center;
  background-color: ${(props) => props.color};
`;

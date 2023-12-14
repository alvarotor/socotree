import styled from 'styled-components/native';
import {Dimensions} from 'react-native';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ion from 'react-native-vector-icons/Ionicons';

export const InnerWrapper = styled.View`
  flex-direction: row;
`;

export const BoxCellContainer = styled.View`
  width: ${Dimensions.get('screen').width / 2 - 20 + 'px'};
  height: ${Dimensions.get('screen').width / 2 - 20 + 'px'};
  justify-content: center;
  align-items: center;
  background: ${(props) => props.background};
  margin-top: 15px;
  margin-left: ${(props) => props.marginStyle + 'px'};
`;

export const IconStyled = styled(Icon)`
  font-size: 70px;
  font-weight: 700;
  color: ${(props) => props.color};
`;

export const IconStyled5 = styled(Icon5)`
  font-size: 70px;
  font-weight: 700;
  color: ${(props) => props.color};
`;

export const IonStyled = styled(Ion)`
  font-size: 70px;
  font-weight: 700;
  color: ${(props) => props.color};
`;

export const ListSection = styled.View`
  margin-bottom: 2px;
  flex: 1;
  display: flex;
`;

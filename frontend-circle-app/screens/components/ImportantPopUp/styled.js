import styled from 'styled-components/native';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {Dimensions} from '../../../theme/Dimensions';

export const ReminderWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`;

export const DescText = styled.Text`
  font-family: 'Roboto-Regular';
  color: black;
  font-size: 18px;
  line-height: 27px;
  padding-right: 30px;
  margin-top: 5px;
`;

export const ContainerWrapper = styled.View`
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background: white;
  margin-bottom: 10px;
  width: 100%;
  padding-vertical: ${Dimensions.DeviceHeight / 38}px;
  padding-horizontal: ${Dimensions.DeviceHeight / 35}px;
`;

export const Exclamation = styled(Icons)`
  font-size: 15px;
  font-weight: 700;
  color: red;
  margin-left: 20px;
`;

export const ImpWrapper = styled.View`
  padding: 20px;
  border-width: 2.5px;
  border-color: #05ea00;
  border-radius: 8px;
  margin-top: ${Dimensions.DeviceHeight / 23}px;
  padding-bottom: ${Dimensions.DeviceHeight / 23}px;
  margin-bottom: 10px;
`;

export const ImpText = styled.Text`
  color: #05ea00;
  font-size: 18px;
  letter-spacing: 2px;
  line-height: 19px;
  font-weight: bold;
`;

export const UnderlineText = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 14px;
  line-height: 21px;
  text-decoration-line: underline;
  margin-top: 5px;
  margin-bottom: 30px;
`;

export const NormalText = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 14px;
  line-height: 21px;
`;

export const ContainerView = styled.View`
  flex: 1;
  width: 100%;
  background: transparent;
  justify-content: flex-end;
  align-items: center;
`;

export const RedButtonView = styled.TouchableOpacity`
  flex: 1;
  height: 48px;
  background-color: #ff541e;
  margin-left: 5px;
  margin-right: 10px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

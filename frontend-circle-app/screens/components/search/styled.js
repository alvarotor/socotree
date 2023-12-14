import styled from 'styled-components/native';
import {Platform} from 'react-native';
export const NameBoldText = styled.Text`
  font-family: 'Roboto-Bold';
  font-size: 25px;
`;

export const NameText = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 25px;
`;

export const BottomView = styled.View`
  height: 2px;
  width: 100%;
  background-color: black;
  margin-bottom: 20px;
  margin-top: ${Platform.OS === 'ios' ? '10px' : '3px'}; ;
`;

export const CloseIcon = styled.TouchableOpacity`
  right: 5px;
  position: absolute;
`;

export const CloseView = styled.View`
  flex: 1;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
`;

export const RoundView = styled.View`
  position: absolute;
  right: 0px;
  height: 30px;
  width: 30px;
  border-radius: 15px;
  border-width: 1px;
  border-color: black;
  background-color:  transparent};
`;

export const RoundSelectedView = styled.View`
  position: absolute;
  right: 0px;
  height: 32px;
  width: 32px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.color ? props.color : 'transparent')};
`;

export const NameView = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ListItemIconWrapper = styled.View`
  position: absolute;
  right: 0px;
  align-items: flex-end;
`;

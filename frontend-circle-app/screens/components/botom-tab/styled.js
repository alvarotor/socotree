import styled from 'styled-components/native';
import IconsMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import IconsM from 'react-native-vector-icons/MaterialIcons';
import IconsFA from 'react-native-vector-icons/FontAwesome5';
import IconsE from 'react-native-vector-icons/Entypo';

export const BottomContainer = styled.View`
  background-color: white;
  box-shadow: 0px -4px 4px rgba(0, 0, 0, 0.08);
  flex-direction: row;
  justify-content: space-around;
  elevation: 8;
  padding: 10px;
`;

export const IconContainer = styled.TouchableOpacity`
  padding: 5px;
  justify-content: center;
  align-items: center;
`;

export const BottomIconM = styled(IconsM)`
  font-size: 25px;
  font-weight: 700;
  color: ${(props) => props.color};
`;

export const BottomIconFA = styled(IconsFA)`
  font-size: 25px;
  font-weight: 700;
  color: ${(props) => props.color};
`;

export const BottomIconE = styled(IconsE)`
  font-size: 25px;
  font-weight: 700;
  color: ${(props) => props.color};
`;

export const BottomIconMCI = styled(IconsMCI)`
  font-size: 25px;
  font-weight: 700;
  color: ${(props) => props.color};
`;

export const TabText = styled.Text`
  font-family: 'Roboto-Regular';
  color: ${(props) => props.color};
  font-size: 10px;
`;

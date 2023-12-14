import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Dimensions, StyleSheet} from 'react-native';

export const VerticalWrap = styled.View`
  flex-direction: row;
`;

export const ReceiveText = styled.Text`
  font-family: 'Roboto-Regular';
  color: grey;
  font-size: 15px;
  margin-top: 30px;
`;

export const SendText = styled.Text`
  font-family: 'Roboto-Regular';
  color: black;
  font-size: 15px;
  font-weight: bold;
`;

export const IconStyled = styled(Icon)`
  font-size: 20px;
  font-weight: 700;
  color: black;
  margin-top: 5px;
  margin-left: 5px;
`;

export const SendAgainView = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const styles = StyleSheet.create({
  view: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeInputFieldStyle: {
    width: Dimensions.get('window').width / 5,
    height: 70,
    borderWidth: 0,
    borderColor: 'black',
    borderBottomWidth: 2,
    color: 'black',
    fontSize: 35,
    fontFamily: 'Roboto-Regular',
  },
});

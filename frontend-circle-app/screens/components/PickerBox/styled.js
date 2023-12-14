import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';

export const StyledWrapper = styled.View`
  background: red;
`;

export const ButtonText = styled.Text`
  margin-top: ${props => (props.BottomBorderOnly ? '7px' : '0px')};
  color: #000;
  font-size: ${props => (props.BottomBorderOnly ? '25px' : '20px')};
  margin-left: ${props => (props.BottomBorderOnly ? '38px' : '0px')};
`;

export const DropDownMenu = styled.ScrollView`
  background-color: #fff;
  border-width: 0.5px;
  border-color: grey;
  max-height: 200px;
`;

export const DropDownText = styled.Text`
  color: #000;
  font-size: 20px;
  text-align: ${props => (props.BottomBorderOnly ? 'right' : 'center')};
`;

export const View = styled.View`
  padding-bottom: 5px;
`;

export const ButtonImage = styled.Image`
  position: absolute;
  right: 15px;
  transform: rotate(90deg);
`;

export const TouchableOpacity = styled.TouchableOpacity`
  height: 40px;
  padding-bottom: 5px;
  padding-top: 5px;
`;

export const ButtonViewWrapper = styled.TouchableOpacity`
  height: ${props => (props.BottomBorderOnly ? '62px' : '44px')};
  align-items: center;
  padding: 5px 5px;
  flex-direction: row;
  border: ${props => (props.BottomBorderOnly ? 'none' : 'solid')};
  border-bottom-width: ${props => (props.BottomBorderOnly ? '2px' : '1px')};
  margin-top: ${props => (props.BottomBorderOnly ? '0' : '20px')};
  justify-content: ${props => (props.BottomBorderOnly ? 'center' : 'center')};
  flex-direction: ${props => (props.BottomBorderOnly ? 'row' : 'column')};
`;

export const ImageFlag = styled.Image`
  height: 20px;
  width: 30px;
  position: absolute;
  top: 22px;
  left: 10px;
`;

export const IconStyled = styled(Icon)`
  font-size: 27px;
  font-weight: 700;
  color: black;
  position: absolute;
  right: 10px;
`;

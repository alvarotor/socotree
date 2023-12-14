import styled from 'styled-components/native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

export const TextWrapper = styled.Text`
  font-size: ${(props) =>
    props.fontSize ? props.fontSize : props.title ? '32px' : '15px'};
  color: ${(props) => (props.color ? props.color : '#000')};
  font-family: ${(props) => (props.title ? 'Roboto-Bold' : 'Roboto-Regular')};
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'left')};
`;

export const LinkIconStyled = styled(IconFontAwesome)`
  font-size: 25px;
  font-weight: 700;
  color: black;
`;

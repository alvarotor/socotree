import styled from 'styled-components/native';

export const ButtonViewWrapper = styled.TouchableOpacity`
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  margin-bottom: 10px;
  background: ${(props) =>
    props.backgroundColor ? props.backgroundColor : '#11E901'};
  opacity: ${(props) => (props.disabled ? '0.4' : '1')};
`;

export const ButtonText = styled.Text`
  font-family: 'Roboto-Regular';
  color: ${(props) => (props.textColor ? props.textColor : '#fff')};
  font-size: 18px;
`;

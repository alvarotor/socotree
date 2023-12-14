import styled from 'styled-components/native';

export const StyledWrapper = styled.View`
  background: red;
`;

export const TextInputWrapper = styled.TextInput`
  font-family: 'Roboto-Regular';
  width: 100%;
  height: 50px;
  color: black;
  font-size: 25px;
  margin-top: 10px;
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'left')};
  background-color: ${(props) =>
    props.backgroundColor && props.backgroundColor !== '#000000'
      ? props.backgroundColor
      : 'transparent'};
`;

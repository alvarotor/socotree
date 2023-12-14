import styled from 'styled-components/native';

export const ContentWrapper = styled.View`
  flex: 1px;
`;

export const InnerWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const DisplayText = styled.Text`
  font-family: 'Roboto-Regular';
  color: ${(props) => props.color};
  font-size: 25px;
`;

export const AddButtonWrapper = styled.View`
  align-items: flex-end;
  margin-top: 20px;
`;

export const AddButton = styled.TouchableOpacity`
  width: 100px;
  height: 40px;
  background-color: #010101;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  margin-bottom: 20px;
`;

export const TapText = styled.View`
  margin-top: 10px;
  margin-bottom: 30px;
`;
export const InputFieldWrapper = styled.View`
  width: 100%;
  padding-top: 20px;
`;

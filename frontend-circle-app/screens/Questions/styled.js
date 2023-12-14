import styled from 'styled-components/native';
// import Icon from 'react-native-vector-icons/AntDesign';

// export const IconStyled = styled(Icon)`
//   font-size: 30px;
//   font-weight: 700;
//   color: black;
//   margin-left: ${(props) =>
//     props.iconStyles ? props.iconStyles + 'px' : '0px'};
// `;

export const SelectButtonContainer = styled.View`
  margin-vertical: 20px;
`;

export const SelectButton = styled.TouchableOpacity`
  height: 50px;
  justify-content: center;
  padding: 10px;
  background-color: ${(props) => props.backgroundColor};
  margin-bottom: 10px;
`;

export const SelectText = styled.Text`
  font-family: 'Roboto-Regular';
  color: ${(props) => props.color};
  font-size: 18px;
`;

// export const IconWrapper = styled.View`
//   flex-direction: row;
// `;

// export const LeftIconWrapper = styled.View`
//   flex: 1px;
//   align-items: flex-start;
// `;

// export const RightIconWrapper = styled.View`
//   flex: 1px;
//   align-items: flex-end;
// `;

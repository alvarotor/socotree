import styled from 'styled-components/native';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ion from 'react-native-vector-icons/Ionicons';

export const ButtonWrapper = styled.View`
  width: 100%;
  margin-top: 30px;
`;

export const DescriptionWrapper = styled.View`
  margin-top: 20px;
  margin-bottom: 40px;
`;

export const ImageOutMainWrapper = styled.View`
  justify-content: center;
  padding-top: 50px;
  margin-bottom: 50px;
  padding-right: 20px;
  margin-left: -20px;
`;

export const List = styled.View`
  width: 100%;
`;

export const ImageContainer = styled.View`
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
`;

export const ImageWrapper = styled.Image`
  width: 100%;
  height: 100%;
`;

export const TextWrapper = styled.View`
  margin-bottom: 20px;
`;

export const TextMainWrapper = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;

export const CountWrapper = styled.View`
  height: 50px;
  width: 50px;
  border-radius: 25px;
  background: #000;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

export const NightImageWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: -10px;
`;

export const IconStyled = styled(Icon)`
  font-size: 20px;
  color: white;
`;

export const IconStyled5 = styled(Icon5)`
  font-size: 20px;
  color: white;
`;

export const IonStyled = styled(Ion)`
  font-size: 20px;
  color: white;
`;

export const IconWrapper = styled.View`
  height: 40px;
  width: 40px;
  border-radius: 20px;
  background: ${(props) => props.background};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  margin-bottom: 10px;
`;

export const ReportWrapper = styled.TouchableOpacity`
  width: 70px;
  height: 35px;
  border: 1.5px;
  border-color: #b0b0b0;
  border-radius: 12px;
  justify-content: center;
  margin-top: 3px;
  align-self: center;
  margin-left: 7px;
`;

export const ReportText = styled.Text`
  font-family: 'Roboto-Regular';
  color: #989898;
  font-size: 15px;
  text-align: center;
`;

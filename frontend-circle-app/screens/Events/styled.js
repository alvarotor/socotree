import styled from 'styled-components/native';
import {Dimensions} from '../../theme/Dimensions';
import Icon from 'react-native-vector-icons/AntDesign';
import {Platform} from 'react-native';

export const TextWrapper = styled.View`
  padding: 25px;
`;

export const DateWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

export const UpcomingWrapper = styled.TouchableOpacity`
  border-radius: 12px;
  background: white;
  margin-vertical: 5px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);
  elevation: 4;
`;

export const ImageContainer = styled.View`
  width: 100%;
  height: 175px;
  border-radius: 12px;
  overflow: hidden;
`;

export const EventText = styled.Text`
  color: black;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 2px;
`;

export const DescriptionText = styled.Text`
  color: black;
  font-size: 16px;
  letter-spacing: 1px;
  line-height: 19px;
  margin-top: 20px;
  width: ${Dimensions.DeviceWidth / 1.55}px;
`;

export const IconStyled = styled(Icon)`
  font-size: 20px;
  font-weight: 700;
  margin-horizontal: 10px;
`;

export const StartContainer = styled.View`
  height: 40px;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  background-color: black;
  position: absolute;
  top: 15px;
  right: 0px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 20px;
  flex-direction: row;
`;

export const JoinNowText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 2px;
  align-self: center;
`;

export const OnlyText = styled.Text`
  color: white;
  font-size: 20px;
  margin-left: 10px;
  line-height: 30px;
  align-self: center;
`;

export const InnerViewUpper = styled.SafeAreaView`
  margin: -30px 15px 0px 15px;
  flex: 1;
  padding-bottom: ${Platform.OS === 'ios' ? '30px' : '0px'};
`;

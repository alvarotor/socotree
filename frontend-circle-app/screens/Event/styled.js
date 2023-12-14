import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import {Dimensions} from '../../theme/Dimensions';

export const TapText = styled.View`
  margin-top: 60px;
  margin-bottom: 15px;
`;

export const SectionText = styled.Text`
  font-family: 'Roboto-Bold';
  font-size: 12px;
  margin-left: 5px;
`;

export const ImageContainer = styled.View`
  width: 100%;
  height: ${DeviceInfo.hasNotch()
    ? `${Dimensions.DeviceHeight / 5}px`
    : `${Dimensions.DeviceHeight / 4}px`};
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
`;

export const ArrowContainer = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  margin-left: 10px;
`;

export const IconStyled = styled(Icon)`
  font-size: 25px;
  font-weight: 700;
  color: black;
`;

export const SectionContainer = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
  position: absolute;
  right: 0;
`;

export const DateContainer = styled.View`
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`;

export const SectionIconStyled = styled(Icon)`
  font-size: 20px;
  font-weight: 700;
`;

export const ClockIconStyled = styled(Icon)`
  font-size: 20px;
  font-weight: 700;
  color: #05ea00;
`;

export const VideoIconStyled = styled(Icons)`
  font-size: 20px;
  font-weight: 700;
`;

export const ConnectText = styled.Text`
  font-family: 'Roboto-Regular';
  color: black;
  font-size: 16px;
  line-height: 24px;
  margin-top: 10px;
`;

export const MoreView = styled.TouchableOpacity`
  padding-vertical: 10px;
`;

export const MoreText = styled.Text`
  font-family: 'Roboto-Regular';
  color: #05ea00;
  font-size: 16px;
`;

export const JoinText = styled.Text`
  font-family: 'Roboto-Regular';
  color: #05ea00;
  font-size: 12px;
`;

export const BottomText = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 16px;
  line-height: 24px;
  margin-right: 30px;
`;

export const ButtonWrapper = styled.View`
  width: 100%;
  margin-bottom: 25px;
  padding-horizontal: 15px;
`;

export const GreyButtonView = styled.TouchableOpacity`
  flex: 1;
  height: 50px;
  background-color: #c9c5c5;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

export const GreenButtonView = styled.View`
  height: 50px;
  border-color: #05ea00;
  border-width: 1px;
  margin: 10px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

export const ButtonText = styled.Text`
  font-family: 'Roboto-Bold';
  font-size: 12px;
  line-height: 16px;
  align-self: center;
  color: #05ea00;
  margin-left: 10px;
`;

export const MustText = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 18px;
  line-height: 27px;
`;

export const UnderlineText = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 18px;
  line-height: 27px;
  text-decoration-line: underline;
  flex-wrap: wrap;
  margin-left: 5px;
`;

export const RowView = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
`;

export const TopView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ShareButton = styled.TouchableOpacity`
  width: 40px;
  height: 30px;
  border-radius: 8px;
  justify-content: center;
  align-items: flex-end;
  margin-right: 20px;
`;

export const ShareIconStyled = styled(Icon)`
  font-size: 24px;
  font-weight: 700;
  color: #05ea00;
`;

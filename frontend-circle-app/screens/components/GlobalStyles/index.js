import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Platform} from 'react-native';
import {Dimensions} from '../../../theme/Dimensions';
import DeviceInfo from 'react-native-device-info';
const hasNotch = DeviceInfo.hasNotch();
const iosHeight = hasNotch ? '55px' : '26px';

export const MainViewWrapper = styled.SafeAreaView`
  flex: 1;
  background: white;
`;

export const SafeAreaViewWrapper = styled.SafeAreaView`
  flex: 1;
  background: white;
`;

export const SafeAreaViewWrapperBottom = styled.SafeAreaView`
  flex: 1;
  margin-bottom: ${Platform.OS === 'ios' ? '0px' : '20px'};
`;

export const InnerViewUpper = styled.SafeAreaView`
  margin: -30px 15px 15px 15px;
  flex: 1;
`;

export const InnerView = styled.SafeAreaView`
  margin: 0px 15px 15px 15px;
  flex: 1;
`;

export const TextWrapper = styled.Text`
  font-size: ${(props) => props.fontSize};
  font-weight: bold;
`;

export const IconVideoOut = styled.View`
  height: 35px;
  width: 35px;
  border-radius: 20px;
  position: absolute;
  right: 20px;
  top: 5px;
`;

export const ButtonWrapper = styled.View`
  height: 50px;
  width: 100%;
`;

export const InputFieldWrapper = styled.View`
  width: 100%;
  padding-top: 50px;
`;

export const LineSeparator = styled.View`
  height: 2px;
  width: 100%;
  background-color: #000000;
`;

export const Separator = styled.Text`
  width: 5%;
  font-size: 25px;
  top: 20px;
  text-align: center;
`;

export const CrossIconStyled = styled(Icon)`
  font-size: 30px;
  font-weight: 700;
  color: black;
`;

export const CrossIconContainerStyled = styled.View`
  position: absolute;
  top: ${Platform.OS === 'ios' ? '50px' : '15px'};
  right: 15px;
  justify-content: center;
  align-items: center;
  z-index: 9;
`;

export const Body = styled.ScrollView`
  padding-horizontal: 15px;
`;

export const ListSection = styled.View`
  margin-top: 24px;
`;

export const SectionTitle = styled.Text`
  font-family: 'Roboto-Bold';
  text-transform: uppercase;
  font-size: 12px;
  color: #010101;
  margin-vertical: 10px;
`;

export const List = styled.TouchableOpacity`
  margin-vertical: 10px;
`;

export const ListText = styled.Text`
  font-size: 20px;
  font-family: 'Roboto-Regular';
  flex: 1;
`;

export const InterestWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const Interest = styled.View`
  height: 35px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background: #0047ff;
  margin-right: 10px;
  margin-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
`;

export const InterestSmall = styled.View`
  height: 18px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background: #0047ff;
  margin-right: 8px;
  margin-bottom: 8px;
  padding-left: 10px;
  padding-right: 10px;
`;

export const InnerWrapper = styled.View`
  margin-top: 20px;
`;

export const MainWrapper = styled.SafeAreaView`
  flex: 1;
  background: #f2fff2;
`;

export const ImageWrapper = styled.Image`
  width: 100%;
  height: 100%;
`;

export const ModalViewWrapper = styled.View`
  flex: 1;
  background: rgba(0, 0, 0, 0.72);
`;

export const ActivityIndicator = styled.ActivityIndicator`
  align-self: center;
  flex: 1;
  height: ${Dimensions.DeviceHeight / 3}px;
`;

export const ButtonDoubleWrapper = styled.View`
  height: ${Platform.OS === 'ios' ? '25px' : '30px'};
  width: 100%;
  flex-direction: row;
  margin-bottom: 15px;
`;

export const GreenButtonFilledView = styled.TouchableOpacity`
  flex: 1;
  height: 48px;
  background-color: #05ea00;
  margin-left: 10px;
  margin-right: 5px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

export const GreyButtonFilledView = styled.TouchableOpacity`
  flex: 1;
  height: 48px;
  background-color: #c4c4c4;
  margin-left: 5px;
  margin-right: 10px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

export const ButtonGreenFilledText = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 16px;
  line-height: 16px;
  align-self: center;
  color: white;
`;

export const FadedSeparator = styled.View`
  height: 40px;
  width: 100%;
`;

export const GrayBar = styled.View`
  width: 100%;
  background-color: #c4c4c4;
  height: ${Platform.OS === 'ios' ? iosHeight : '7px'};
  margin-bottom: ${Platform.OS === 'ios' ? '0px' : '10px'};
`;

export const GreenBar = styled.View`
  height: 7px;
  width: ${(props) => props.width + '%'};
  background-color: #05ea00;
`;

export const NotYetText = styled.Text`
  align-self: center;
  font-family: 'Roboto-Regular';
  flex: 1;
`;

export const Triangle = styled.View`
  width: 0;
  height: 0;
  background-color: transparent;
  border-style: solid;
  border-left-width: ${Dimensions.DeviceWidth}px;
  border-top-width: 100px;
  border-left-color: transparent;
  border-top-color: #f2fff2;
`;

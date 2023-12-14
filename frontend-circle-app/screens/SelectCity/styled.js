import styled from 'styled-components/native';
import {STATUSBAR_HEIGHT} from '../components/statusBar';
import Icon from 'react-native-vector-icons/AntDesign';
import {Dimensions} from 'react-native';

export const TitleView = styled.View`
  height: 8%;
  align-items: center;
  background-color: #f2fef2;
  flex-direction: row;
  margin-top: -${STATUSBAR_HEIGHT}px;
  padding-left: 3%;
`;

export const InnerViewUpper = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 100px;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  padding-horizontal: 15px;
  padding-bottom: 20px;
`;
export const MainViewUpper = styled.View`
  flex: 1;
  width: 100%;
  background-color: white;
`;

export const InnerGreenViewUpper = styled.View`
  flex: 0.4;
  width: 100%;
  background-color: #f2fff2;
  padding-top: 20px;
`;

export const CenterImage = styled.Image`
  flex: 1;
  width: ${Dimensions.get('window').width}px;
  resize-mode: contain;
  margin-bottom: 20px;
`;

export const InnerImage = styled.Image`
  height: 200px;
  width: 40px;
`;

export const PickerWrapper = styled.TouchableOpacity`
  height: 50px;
  width: 100%;
  border-width: 1px;
  border-color: #05ea00;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 30px;
`;
export const IconStyled = styled(Icon)`
  font-size: 27px;
  font-weight: 700;
  color: black;
  position: absolute;
  right: 10px;
  color: #05ea00;
`;

//popupstyles

export const OptionsWrapper = styled.View`
  background-color: white;
  border-radius: 10px;
  width: 100%;
  margin-bottom: 10px;
`;

export const Option = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  height: 40px;
`;
export const Separator = styled.View`
  width: 100%;
  height: 1px;
  background-color: #3c3c43;
  position: absolute;
  bottom: 0px;
`;

export const GotItWrapper = styled.View`
  background-color: white;
  border-radius: 10px;
  width: 100%;
  margin-bottom: 10px;
  padding-horizontal: 15px;
  padding-vertical: 25px;
`;

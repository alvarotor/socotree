import styled from 'styled-components/native';
import {STATUSBAR_HEIGHT} from '../components/statusBar';
import Icon from 'react-native-vector-icons/AntDesign';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export const TitleView = styled.View`
  height: 8%;
  align-items: center;
  background-color: #f2fef2;
  flex-direction: row;
  margin-top: -${STATUSBAR_HEIGHT}px;
  padding-left: 3%;
`;

export const InnerViewUpper = styled.View`
  margin-top: 5px;
  flex: 1;
  width: 100%;
`;

export const SocialMediaBtnRow = styled.View`
  flex-direction: row;
  margin-top: 15px;
  align-items: center;
  justify-content: center;
`;

export const SocialMediaIcon = styled(Icon)`
  font-size: 30px;
  font-weight: 700;
  color: black;
`;
export const WatsAppIcon = styled(IconFontAwesome)`
  font-size: 30px;
  font-weight: 700;
  color: black;
`;

export const TelegramIcon = styled(EvilIcons)`
  font-size: 40px;
  font-weight: 700;
  color: black;
`;

export const SocialMediaBtnContainer = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

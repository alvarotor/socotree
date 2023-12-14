import styled from 'styled-components/native';
import {Platform} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

export const MainWrapper = styled.SafeAreaView`
  flex: 1;
  background: #eafffc;
`;

export const IconStyled = styled(Icon)`
  font-size: 30px;
  font-weight: 700;
  color: black;
`;

export const CameraIconStyled = styled(IconFontAwesome)`
  font-size: 25px;
  font-weight: 700;
  color: black;
`;

export const HeaderView = styled.View`
  flex-direction: row;
  height: 45px;
  width: 100%;
  padding: 0 20px;
  margin-top: ${Platform.OS === 'ios' ? '5px' : '0px'};
  justify-content: center;
`;

export const IconArrowMain = styled.TouchableOpacity`
  height: 35px;
  width: 35px;
  border-radius: 20px;
  position: absolute;
  left: 20px;
  top: 5px;
`;

export const ImageWrapperProfile = styled.Image`
  height: 35px;
  width: 35px;
  border-radius: 20px;
`;

export const LeftMessagesContainer = styled.View`
  flex-direction: row;
  padding: 0px 10px;
`;

export const MessageMain = styled.View`
  margin-left: 5px;
`;

export const BorderView = styled.View`
  width: 100%;
  border-color: #ccc;
  border-top-width: 0.5px;
  margin-top: 5px;
  margin-bottom: 10px;
`;

export const LeftMsgOutMain = styled.View`
  min-width: 120px;
  margin: 1px;
  position: relative;
  align-self: flex-start;
`;

export const InputBoxContainer = styled.View`
  align-self: center;
`;

export const ChatView = styled.View`
  flex: 1;
  margin-bottom: 12px;
`;

export const LeftMsgOut1 = styled.View`
  background-color: #f4ebe4;
  border-radius: 15px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  padding: 12px;
`;

export const LeftMsgOut2 = styled.View`
  background-color: #f4ebe4;
  border-radius: 15px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  padding: 12px;
`;

export const TextInputWrapper = styled.TextInput`
  background-color: #f2f6fe;
  height: 50px;
  border-radius: 12px;
`;

export const IconContainer = styled.View`
  margin-bottom: ${Platform.OS === 'ios' ? '90px' : '60px'};
  margin-top: ${Platform.OS === 'ios' ? '-40px' : '0px'};
  margin-right: ${Platform.OS === 'ios' ? '-10px' : '0px'};
`;

export const BirthDateWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
`;

export const UserDetailWrapper = styled.View`
  width: 90%;
`;

export const ButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const VideoBtnWrapper = styled.TouchableOpacity`
  height: 35px;
  width: 80px;
  border-radius: 10px;
  position: absolute;
  right: 20px;
  top: 5px;
  align-items: flex-end;
  justify-content: center;
`;

export const ShareLocationWrapper = styled.TouchableOpacity`
  width: 80%;
  height: 40px;
  border: 1.5px;
  border-color: #b0b0b0;
  border-radius: 12px;
  justify-content: center;
  margin-top: 3px;
  margin-bottom: 10px;
  align-self: center;
  margin-left: 10%;
  margin-right: 20%;
`;

export const ActivityIndicator = styled.ActivityIndicator`
  align-self: center;
  flex: 1;
  height: 50px;
`;

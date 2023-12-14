import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {STATUSBAR_HEIGHT} from '../statusBar';

export const MainViewWrapper = styled.View`
  width: 100%;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;

export const StatusBarWrapper = styled.View`
  position: absolute;
  width: 100%;
  top: -${STATUSBAR_HEIGHT}px;
`;

export const TitleText = styled.Text`
  margin-bottom: 15px;
  font-size: 32px;
  align-self: flex-start;
  letter-spacing: 2px;
  font-family: 'Roboto-Bold';
  color: white;
  margin-left: 15px;
`;

export const MatchText = styled.Text`
  margin-bottom: 5px;
  font-size: 24px;
  letter-spacing: 2px;
  font-family: 'Roboto-Bold';
  color: white;
`;

export const TimeText = styled.Text`
  font-size: 24px;
  color: white;
  font-family: 'Roboto-Bold';
  margin-left: 10px;
`;

export const TimeWrapper = styled.View`
  align-self: center;
`;

export const ClockWrapper = styled.View`
  align-self: center;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 15px;
`;

export const ClockIconStyled = styled(Icon)`
  font-size: 25px;
  color: white;
  align-self: center;
`;

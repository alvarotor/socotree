import styled from 'styled-components/native';
import {Platform} from 'react-native';

export const ChatWrapper = styled.TouchableOpacity`
  border-radius: 12px;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);
  elevation: 4;
  padding: 10px;
  min-height: 100px;
  justify-content: center;
`;

export const ContainerWrapper = styled.TouchableOpacity`
  border-radius: 12px;
  margin-vertical: 8px;
  padding-bottom: 10px;
  overflow: hidden;
`;

export const ImageContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  margin-left: -8px;
  margin-bottom: -8px;
  z-index: 9;
`;

export const FriendsContainer = styled.View`
  flex-direction: row;
  flex: 1;
`;

export const JoinContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: flex-start;
  flex: ${(props) => props.flex};
  margin-left: 10px;
`;

export const TextContainer = styled.TouchableOpacity`
  justify-content: center;
  flex: ${(props) => props.flex};
`;

export const CountContainer = styled.View`
  min-width: 28px;
  min-height: 28px;
  padding: 3px;
  border-radius: 14px;
  background-color: #ff541e;
  align-self: center;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 5px;
`;

export const NameContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

export const TextWrapper = styled.TouchableOpacity`
  flex-direction: row;
  flex-wrap: wrap;
  overflow: hidden;
  padding-right: 10px;
`;

export const TitleView = styled.View`
  margin-bottom: 10px;
`;

export const ImageView = styled.View`
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

export const ActivityIndicator = styled.ActivityIndicator`
  align-self: center;
  flex: 1;
`;

export const InnerViewUpper = styled.SafeAreaView`
  margin: -30px 15px 0px 15px;
  flex: 1;
  padding-bottom: ${Platform.OS === 'ios' ? '30px' : '0px'};
`;

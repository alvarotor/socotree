import {StyleSheet, Dimensions, Platform} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHight = Dimensions.get('window').height;
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';

export const VideoIcon = styled(MaterialIcons)`
  font-size: ${(props) => props.size + 'px'};
  color: white;
`;

export const AwesomeIcon = styled(IconFontAwesome5)`
  font-size: ${(props) => props.size + 'px'};
  color: white;
`;

export const ModalViewWrapper = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
`;
export const ModalInnerViewWrapper = styled.View`
  justify-content: center;
  align-items: center;
  padding-horizontal: 20px;
  margin-top: 40px;
`;

export const CrossButtonWrapper = styled.TouchableOpacity`
  margin-top: 40px;
  width: 30px;
  height: 30px;
  margin-left: 20px;
`;
export const ImageTextRow = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
`;

export const ImageContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  margin-right: 20px;
`;
export const InterestContainer = styled.View`
  margin-top: 20px;
`;

export const ImageWrapper = styled.Image`
  width: 100%;
  height: 100%;
`;

export const CrossWhiteIconStyled = styled(Icon)`
  font-size: 30px;
  font-weight: 700;
  color: white;
`;

export const styles = StyleSheet.create({
  btnRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  btnRowTopPosition: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnRowContainer: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 20,
  },
  outerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  button: {
    marginTop: 100,
  },
  localVideoOnButtonEnabled: {
    bottom: '40%',
    width: '35%',
    left: '64%',
    height: '25%',
    zIndex: 2,
  },
  localVideoOnButtonDisabled: {
    bottom: '30%',
    width: '35%',
    left: '64%',
    height: '25%',
    zIndex: 2,
  },
  callContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  remoteGrid: {
    flex: 1,
    width: windowWidth,
    height: windowHight,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  onlyUser: {},
  remoteVideo: {
    width: '50%',
    height: '50%',
  },
  fullScreenRemoteVideo: {
    width: '100%',
    height: '100%',
  },
  soundOptionButton: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(196,78,65)',
    borderRadius: 28,
    marginBottom: 34,
  },
  soundOptionButtonSmall: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(196,78,65)',
    borderRadius: 16,
    marginBottom: 10,
  },
  optionButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(25,20,13,0.6)',
    borderRadius: 22,
    margin: 2,
  },
  optionButtonSmall: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(25,20,13,0.6)',
    borderRadius: 16,
    margin: 2,
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainerUsers: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  buttonContainer: {
    borderWidth: 1,
    width: 200,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: windowWidth / 3,
    justifyContent: 'center',
  },
  localVideo: {
    width: '100%',
    height: 140,
  },
  localVideoTopPosition: {
    width: '30%',
    height: 140,
    alignSelf: 'flex-end',
  },
  optionsContainerTopPosition: {
    position: 'absolute',
    paddingHorizontal: 28,
    paddingVertical: 40,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  exitButton: {
    left: 20,
    top: Platform.OS === 'ios' ? 25 : 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 5,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 20 : 10,
    marginTop: Platform.OS === 'ios' ? 20 : 10,
  },
});

export const InnerWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

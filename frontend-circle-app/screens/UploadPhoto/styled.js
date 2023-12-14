import styled from 'styled-components/native';
import {Dimensions} from 'react-native';

export const ImageWrapper = styled.Image`
  width: 150px;
  height: 100px;
`;

export const UserImage = styled.Image`
  width: 150px;
  height: 100px;
  height: ${Dimensions.get('window').width - 70}px;
  width: ${Dimensions.get('window').width - 70}px;
  border-radius: ${(Dimensions.get('window').width - 70) / 2}px;
`;

export const ImageOut = styled.View`
  overflow: hidden;
`;

export const UploadPhotoWrapper = styled.View`
  height: ${Dimensions.get('window').width - 70}px;
  width: ${Dimensions.get('window').width - 70}px;
  border-radius: ${(Dimensions.get('window').width - 70) / 2}px;
  background: #000;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const PhotoContainer = styled.View`
  justify-content: center;
  align-items: center;
  display: flex;
  flex: 1;
  padding-top: 50px;
`;

export const ModalWrapper = styled.View`
  display: flex;
  flex: 1;
  background: rgb(255, 255, 255);
`;

export const ModalInnerView = styled.View`
  justify-content: flex-end;
  display: flex;
  margin: 0px 15px 15px 15px;
  flex: 1;
`;

export const SelectedImageWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 20%;
`;

export const EditImageWrapper = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  position: absolute;
  background: black;
  justify-content: center;
  align-items: center;
  right: 30px;
  top: ${Dimensions.get('window').width - 130}px;
`;

export const CameraImage = styled.Image`
  width: 40px;
  height: 30px;
`;

export const BottomTextWrapper = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

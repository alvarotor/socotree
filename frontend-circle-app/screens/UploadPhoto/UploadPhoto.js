import React, {useState, useContext, useEffect} from 'react';
import {defaultProps, propTypes} from '../components/props';
import {request, PERMISSIONS, openSettings} from 'react-native-permissions';
import {
  ImageWrapper,
  UploadPhotoWrapper,
  ImageOut,
  PhotoContainer,
  ModalWrapper,
  ModalInnerView,
  SelectedImageWrapper,
  UserImage,
  EditImageWrapper,
  CameraImage,
  BottomTextWrapper,
} from './styled';
import {
  MainViewWrapper,
  InnerView,
  ButtonWrapper,
  Separator,
  CrossIconStyled,
  CrossIconContainerStyled,
  GrayBar,
  GreenBar,
} from '../components/GlobalStyles';
import {AppHeader} from '../components/app-header';
import {TitleText} from '../components/title-text';
import {Button} from '../components/button';
import {
  Modal,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import {updateUserData} from '../../core';
import URL from '../../env';
import RNFS from 'react-native-fs';
import ENV from '../../active.env';
import {UserContext} from '../UserContext';
import * as CommonActions from '@react-navigation/routers/src/CommonActions';
import ImagePicker from 'react-native-image-crop-picker';
import {identify, trackScreen, track} from '../segment';

export const UploadPhotoScreen = ({navigation, route}) => {
  const {settings, profile} = route.params;
  const {user, setUser} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  useEffect(() => {
    trackScreen('UploadPhoto', user.userid);
  });

  const requestToAccessPhotoLibrary = () => {
    request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
      if (result !== 'granted') {
        Alert.alert(
          'Permission for settings',
          'We need permission to access the photos in your phone, we will redirect you to settings.',
          [
            {
              text: 'No',
            },
            {
              text: 'Yes, please',
              onPress: () => {
                openSettings().catch(() =>
                  console.warn('cannot open settings'),
                );
              },
            },
          ],
          {
            cancelable: true,
          },
        );
      } else {
        choosePhoto();
      }
    });
  };

  const [myPhoto, setMyPhoto] = useState({
    uri: user.profile.photo,
  });
  const [modalPicture, setModalPicture] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false);

  const [selectedPic, setSelectedPic] = useState(false);

  const choosePhoto = () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 300,
      height: 300,
      hideBottomControls: true,
      showCropGuidelines: false,
    }).then((image) => {
      setSelectedPic(true);
      setMyPhoto({...image, uri: image.path, type: image.mime});
    });
  };

  const handleChoosePhoto = () => {
    if (Platform.OS === 'ios') {
      requestToAccessPhotoLibrary();
    } else {
      choosePhoto();
    }
  };

  const createFormData = (photoForm) => {
    const data = new FormData();
    data.append('photo', {
      name: user.userid,
      type: photoForm.type,
      uri: photoForm.uri,
    });
    return data;
  };

  const createDataBase64 = async (photoData) => {
    const uri = photoData.uri.replace('file://', '');
    const res64 = await RNFS.readFile(uri, 'base64');
    return JSON.stringify({
      type: photoData.type,
      userID: user.userid,
      uri,
      data: `data:${photoData.type};base64,${res64}`,
    });
  };

  const uploadPhoto = async () => {
    const headers =
      Platform.OS === 'android'
        ? {
            Authentication: user.token,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }
        : {
            Authentication: user.token,
          };

    return await fetch(URL.APIUPLOAD, {
      method: 'POST',
      headers,
      body:
        Platform.OS === 'android'
          ? createFormData(myPhoto)
          : await createDataBase64(myPhoto),
    });
  };

  const handleUploadPhoto = async () => {
    crashlytics().log('handleUploadPhoto');
    if ((!myPhoto && !myPhoto.uri) || !selectedPic) {
      Alert.alert('Upload Photo', 'You must select a photo first.');
      return;
    }

    try {
      if (uploadInProgress) {
        return;
      }

      setUploadInProgress(true);

      const r = await uploadPhoto();
      const res = await r.json();
      if (res.Status === 'true') {
        user.profile.photo = URL.APIPHOTO(res.App);
        await updateUserData(user).then(() => {
          updateUser(user);
          Alert.alert('Updating Data', 'Your picture is uploaded', [
            {
              text: 'OK',
              onPress: () => {
                setModalPicture(!modalPicture);
                setUploadInProgress(false);
              },
            },
          ]);
        });
        await identify(user.userid, user.email, user.profile);
      }
    } catch (err) {
      console.log(err);
      if (err) {
        crashlytics().recordError(new Error(err));
        track('ERROR handleUploadPhoto', {message: JSON.stringify(err)});
      }
      setUploadInProgress(false);
      Alert.alert('Update Data Error', err.message || err);
    }
  };

  const updateUser = (u) => {
    const p = {
      ...u.profile,
      photo: u.profile.photo,
    };
    const updatedUser = {
      ...u,
      profile: p,
    };
    setUser(updatedUser);
  };

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={modalPicture}>
        <ModalWrapper>
          <CrossIconContainerStyled>
            <TouchableOpacity
              underlayColor="#ffffff00"
              onPress={() => {
                if (selectedPic) {
                  Alert.alert(
                    'Upload Photo',
                    'You have selected a photo but have not uploaded it.',
                  );
                } else {
                  setModalPicture(!modalPicture);
                }
              }}>
              <CrossIconStyled name={'closecircle'} />
            </TouchableOpacity>
          </CrossIconContainerStyled>
          <ModalInnerView>
            <SelectedImageWrapper>
              {!!myPhoto && !!myPhoto.uri && <UserImage source={myPhoto} />}
            </SelectedImageWrapper>
            <Separator />
            <Button
              backgroundColor={'black'}
              buttonText="Select from gallery"
              onPress={handleChoosePhoto}
            />
            <Button
              backgroundColor={'black'}
              onPress={handleUploadPhoto}
              disabled={
                (!myPhoto || !myPhoto.uri || !selectedPic) && !uploadInProgress
              }
              buttonText="Upload Photo"
            />
          </ModalInnerView>
        </ModalWrapper>
      </Modal>
      <MainViewWrapper>
        {!settings ? (
          <GrayBar>
            <GreenBar width={(100 / 6) * 6} />
          </GrayBar>
        ) : null}
        <AppHeader navigation={navigation} />
        <InnerView>
          <ScrollView showsVerticalScrollIndicator={false}>
            <PhotoContainer>
              <TitleText
                title={true}
                text="Upload your profile photo"
                fontSize={'40px'}
                textAlign={'center'}
              />
              <UploadPhotoWrapper>
                <ImageOut>
                  <TouchableOpacity
                    onPress={() => setModalPicture(!modalPicture)}>
                    {!!myPhoto && !!myPhoto.uri ? (
                      <UserImage source={myPhoto} />
                    ) : (
                      <ImageWrapper
                        source={require('../components/images/camera_img.png')}
                      />
                    )}
                  </TouchableOpacity>
                </ImageOut>
                {!!myPhoto && !!myPhoto.uri && (
                  <EditImageWrapper>
                    <TouchableOpacity
                      onPress={() => setModalPicture(!modalPicture)}>
                      <CameraImage
                        source={require('../components/images/camera_img.png')}
                      />
                    </TouchableOpacity>
                  </EditImageWrapper>
                )}
              </UploadPhotoWrapper>
              <BottomTextWrapper>
                <TitleText
                  text="Keep in mind, your photo must be a real photo of you, otherwise your application will be rejected."
                  color={'rgba(1, 1, 1, 0.45);'}
                  fontSize={'15px'}
                  textAlign={'center'}
                />
              </BottomTextWrapper>
            </PhotoContainer>
          </ScrollView>
          <ButtonWrapper>
            {!!myPhoto.uri || ENV === 'dev' ? (
              <Button
                buttonText="Continue"
                onPress={async () => {
                  // if (user.profile.adminverified) {
                  updateUser(user);
                  if (settings) {
                    navigation.navigate('EditProfile');
                  } else if (profile) {
                    navigation.navigate('Profile');
                  } else {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{name: 'Events'}],
                      }),
                    );
                  }
                  // } else {
                  //   updateUser(user);
                  //   navigation.dispatch(
                  //     CommonActions.reset({
                  //       index: 0,
                  //       routes: [{name: 'YouAreListed'}],
                  //     }),
                  //   );
                  // }
                }}
              />
            ) : (
              <Button
                backgroundColor={'black'}
                buttonText="Add a picture"
                onPress={() => setModalPicture(!modalPicture)}
              />
            )}
          </ButtonWrapper>
        </InnerView>
      </MainViewWrapper>
    </>
  );
};

UploadPhotoScreen.defaultProps = defaultProps;
UploadPhotoScreen.propTypes = propTypes;

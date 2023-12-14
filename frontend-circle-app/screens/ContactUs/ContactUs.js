import React, {useEffect} from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {WebView} from 'react-native-webview';
import {ActivityIndicator, Linking} from 'react-native';
import {trackScreen} from '../segment';
import {
  TitleView,
  InnerViewUpper,
  SocialMediaIcon,
  SocialMediaBtnRow,
  WatsAppIcon,
  TelegramIcon,
  SocialMediaBtnContainer,
} from './styled';
import {TitleText} from '../components/title-text';
import {BottomTab} from '../components/botom-tab';
import {MainWrapper, MainViewWrapper} from '../components/GlobalStyles';
import {AppHeader} from '../components/app-header';
import {Template} from '../components/keyboard-safe-view';

export const ContactUsScreen = ({navigation}) => {
  useEffect(() => {
    trackScreen('ContactUs', '');
  });

  const onOpenWatsApp = () => {
    Linking.openURL('https://chat.whatsapp.com/Fp6a9zXXSq11abMI2aQi8g');
  };

  const onOpenFacebook = () => {
    Linking.openURL(
      'https://www.facebook.com/Circles_Official-101062008359223',
    );
  };

  const onOpenInstagram = () => {
    Linking.openURL('https://www.instagram.com/circlescrew/');
  };

  const onOpenTelegram = () => {
    Linking.openURL('https://t.me/joinchat/QYZQtqc7iVg3ZWNl');
  };

  const onOpenTwitter = () => {
    Linking.openURL('https://twitter.com/circlesOfficia3');
  };

  const LoadingIndicatorView = () => (
    <ActivityIndicator
      animating={true}
      color="#05EA00"
      style={{height: '100%'}}
      size="large"
    />
  );

  return (
    <Template>
      <MainViewWrapper>
        <MainWrapper>
          <AppHeader
            navigation={navigation}
            backgroundColor={'#F2FFF2'}
            leftButton={{isHidden: true}}
          />
          <InnerViewUpper>
            <TitleView>
              <TitleText title={true} text="Contact Us" />
            </TitleView>
            <SocialMediaBtnRow onPress={onOpenTelegram}>
              <SocialMediaBtnContainer onPress={onOpenTelegram}>
                <TelegramIcon name={'sc-telegram'} size={28} />
              </SocialMediaBtnContainer>
              <SocialMediaBtnContainer onPress={onOpenFacebook}>
                <SocialMediaIcon name={'facebook-square'} size={28} />
              </SocialMediaBtnContainer>
              <SocialMediaBtnContainer onPress={onOpenWatsApp}>
                <WatsAppIcon name={'whatsapp'} size={28} />
              </SocialMediaBtnContainer>
              <SocialMediaBtnContainer onPress={onOpenInstagram}>
                <SocialMediaIcon name={'instagram'} size={28} />
              </SocialMediaBtnContainer>
              <SocialMediaBtnContainer onPress={onOpenTwitter}>
                <SocialMediaIcon name={'twitter'} size={28} />
              </SocialMediaBtnContainer>
            </SocialMediaBtnRow>
            <WebView
              originWhitelist={['*']}
              source={{
                uri: 'https://delighted.com/t/UXmsrBcF',
              }}
              renderLoading={LoadingIndicatorView}
              startInLoadingState={true}
              containerStyle={{width: '100%'}}
            />
          </InnerViewUpper>
          <BottomTab isContact={true} navigation={navigation} />
        </MainWrapper>
      </MainViewWrapper>
    </Template>
  );
};

ContactUsScreen.defaultProps = defaultProps;
ContactUsScreen.propTypes = propTypes;

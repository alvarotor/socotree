import React, {useEffect} from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {WebView} from 'react-native-webview';
import {MainViewWrapper, InnerView} from '../components/GlobalStyles';
import {ActivityIndicator} from 'react-native';
import {ScreenHeaderShape} from '../components/screen-header-shape';
import {AppHeader} from '../components/app-header';
import {trackScreen} from '../segment';

export const TermsOfUseScreen = ({navigation}) => {
  useEffect(() => {
    trackScreen('TermsOfUse', '');
  });

  const LoadingIndicatorView = () => (
    <ActivityIndicator color="black" style={{height: '100%'}} size="large" />
  );

  return (
    <MainViewWrapper>
      <AppHeader navigation={navigation} backgroundColor={'#f2fff2'} />
      <ScreenHeaderShape titleText={'Privacy Policy & Terms of use'} />
      <InnerView>
        <WebView
          originWhitelist={['*']}
          source={{
            uri: 'https://getcircles.com/privacy-policy-and-terms-of-use-app',
          }}
          renderLoading={LoadingIndicatorView}
          startInLoadingState={true}
        />
      </InnerView>
    </MainViewWrapper>
  );
};

TermsOfUseScreen.defaultProps = defaultProps;
TermsOfUseScreen.propTypes = propTypes;

import React from 'react';
import {View, StatusBar, Platform,Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? DeviceInfo.hasNotch() ?Dimensions.get('window').height/18.5: 20 : StatusBar.currentHeight;

const StatusBarColor = ({backgroundColor, header, ...props}) => {
  if (Platform.OS === 'android') {
    return (
      <StatusBar backgroundColor={backgroundColor} barStyle="dark-content" />
    );
  } else {
    return (
      <View
        style={[{height: header ? 0 : STATUSBAR_HEIGHT}, {backgroundColor}]}>
        <StatusBar backgroundColor={backgroundColor} {...props} />
      </View>
    );
  }
};

export default StatusBarColor;
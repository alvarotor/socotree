import {Dimensions as dim} from 'react-native';

// Get device dimensions
const DeviceHeight = dim.get('window').height;
const DeviceWidth = dim.get('window').width;

export const Dimensions = {
  DeviceHeight,
  DeviceWidth,
};

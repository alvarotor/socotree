import DeviceInfo from 'react-native-device-info';
import URL from '../env';

export const deviceData = async () => {
  console.log(DeviceInfo.getApplicationName());
  console.log(DeviceInfo.getBrand());
  console.log(DeviceInfo.getManufacturerSync());
  console.log(DeviceInfo.getModel());
  console.log(DeviceInfo.getUniqueId());
  console.log(await DeviceInfo.getManufacturer());
  console.log(DeviceInfo.getDeviceId());
  console.log(DeviceInfo.getSystemName());
  console.log(DeviceInfo.getSystemVersion());
  console.log(DeviceInfo.getBundleId());
  console.log(URL.API);
  console.log(DeviceInfo.getBuildNumber());
  console.log(DeviceInfo.getVersion());
  console.log(await DeviceInfo.getDeviceName());
};

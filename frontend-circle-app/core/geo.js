import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';

Geocoder.init('AIzaSyDUZ8erw5xJy40ake1Tu_Fhw5pp1azwmAY');

const getCurrentPosition = async () => {
  const opt = {
    timeout: 15000,
    maximumAge: 10000,
    // accuracy: { ios: "hundredMeters", android: "balanced" },
    enableHighAccuracy: true,
    // distanceFilter:0,
    // showLocationDialog: true,
    // forceRequestLocation: true,
  };
  const getCurrentPositionPromise = () =>
    new Promise((resolve, error) =>
      Geolocation.getCurrentPosition(resolve, error, opt),
    );

  try {
    const data = await getCurrentPositionPromise();
    const latlong = `${data?.coords?.latitude}, ${data?.coords?.longitude}`;
    return {status: true, ...data, latlong};
  } catch (error) {
    console.log('getCurrentPositionPromise::catcherror =>', error);
    return {status: false, message: error};
  }
};

const getLocationUser = async (address) => {
  try {
    let locationDetails = [];
    const data = await getCurrentPosition();
    console.log('data', data);
    const {latitude, longitude} = data.coords;
    console.log('latitude, longitude', latitude, longitude);
    // locationDetails.push({latitude: 47.4980525, longitude: 19.0440144});
    // console.log('locationDetails', locationDetails);
    locationDetails.push({latitude, longitude});
    if (address) {
      const json = await Geocoder.from(latitude, longitude);
      var addressComponent = json.results[0].formatted_address;
      // console.log('formatted_address --> ', json.results[0].formatted_address);
      locationDetails.push(addressComponent);
    }
    return Promise.resolve(locationDetails);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const requestLocation = async (address) => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This App needs access to your location so we can know where you are.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const gLU = await getLocationUser(address);
        console.log('gLU', gLU);
        return Promise.resolve(gLU);
      } else {
        throw new Error('Location permission denied');
      }
    } else {
      const granted = await Geolocation.requestAuthorization('whenInUse');
      if (granted === 'granted') {
        const gLU = await getLocationUser(address);
        console.log('gLU', gLU);
        return Promise.resolve(gLU);
      } else {
        throw new Error('Location permission denied');
      }
    }
  } catch (err) {
    console.error('err', err);
    return Promise.reject(err);
  }
};

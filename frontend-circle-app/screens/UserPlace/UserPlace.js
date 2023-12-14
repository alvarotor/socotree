import React, {useEffect, useState} from 'react';
import {defaultProps, propTypes} from '../components/props';
import {SafeAreaViewWrapper, Body, ListText} from '../components/GlobalStyles';
import {BottomTab} from '../components/botom-tab';
import {requestLocation} from '../../core/geo';
import MapView from 'react-native-maps';
import {StyleSheet, View, Dimensions, Alert} from 'react-native';

export const UserPlaceScreen = ({navigation}) => {
  const [forceRefresh, setForceRefresh] = useState(
    Math.floor(Math.random() * 100),
  );
  const [userAddress, setUserAddress] = useState('');
  const [latLng, setLatLng] = useState({
    latitude: 0,
    longitude: 0,
  });

  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.001;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const styles = StyleSheet.create({
    container: {
      // ...StyleSheet.absoluteFillObject,
      height: 400,
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  useEffect(() => {
    const rl = async () => {
      try {
        const locationDetails = await requestLocation(true);
        console.log('locationDetails', locationDetails);
        if (locationDetails) {
          setLatLng(locationDetails[0]);
          setUserAddress(locationDetails[1]);
          setForceRefresh(Math.floor(Math.random() * 100));
        }
      } catch (error) {
        Alert.alert(error.message);
      }
    };
    rl();
  }, []);

  return (
    <SafeAreaViewWrapper>
      <Body>
        <ListText>My Location</ListText>
        <ListText>
          {latLng.latitude.toString() + ' ' + latLng.longitude.toString()}
        </ListText>
        <ListText>{userAddress.toString()}</ListText>
        <View style={styles.container}>
          <MapView
            key={forceRefresh}
            style={styles.map}
            zoomEnabled={true}
            initialRegion={{
              latitude: latLng.latitude,
              longitude: latLng.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          />
        </View>
      </Body>
      <BottomTab isProfile={true} navigation={navigation} />
    </SafeAreaViewWrapper>
  );
};

UserPlaceScreen.defaultProps = defaultProps;
UserPlaceScreen.propTypes = propTypes;

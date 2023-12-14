import {Alert} from 'react-native';
import ENV from '../env';
import crashlytics from '@react-native-firebase/crashlytics';
import {track} from '../screens/segment';
import active from '../active.env';

export default async function fetchGraphQL(
  text,
  variables,
  token,
  showAlert = true,
) {
  crashlytics().log('fetchGraphQL');
  const url = `${ENV.API}api/v1/graphql/`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authentication: `${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  }).catch((error) => {
    crashlytics().recordError(
      new Error(error.message || JSON.stringify(error)),
    );
    Alert.alert('Fetch Error', error.message || JSON.stringify(error));
    track('ERROR Fetch Error', {message: JSON.stringify(error)});
    console.log('Fetch Error', error);
    return Promise.reject(error);
  });

  let responseGQL = await res.json();

  if (responseGQL.errors && responseGQL.errors.length > 0) {
    const title = active === 'prod' ? 'ERROR' : 'ERROR graphql';
    crashlytics().recordError(new Error(responseGQL.errors[0].message));
    track(title, {message: responseGQL.errors[0].message});
    console.log(title, responseGQL.errors[0]);
    if (showAlert) {
      Alert.alert(title, responseGQL.errors[0].message);
    }
    return Promise.reject(responseGQL.errors[0]);
  }
  return Promise.resolve(responseGQL);
}

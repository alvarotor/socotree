// import React, {useEffect, useContext} from 'react';
// import {defaultProps, propTypes} from '../components/propsNavigation';
// import {
//   DescriptionWrapper,
//   ImageOutMainWrapper,
//   ListText,
//   ButtonWrapper,
// } from './styled';
// import {AppHeader} from '../components/app-header';
// import {TitleText} from '../components/title-text';
// import {ProfileImageBubble} from '../components/ProfileImageBubble';
// import {ScrollView, Alert} from 'react-native';
// import {MainViewWrapper, InnerView} from '../components/GlobalStyles';
// import {HowCirclesWorksScreen} from './HowCirclesWorks';
// import {logOut, readIfUserVerified} from '../../core';
// import {Button} from '../components/button';
// import {UserContext} from '../UserContext';
// import * as CommonActions from '@react-navigation/routers/src/CommonActions';
// import {trackScreen, identify} from '../segment';

// export const YouAreListedScreen = ({navigation}) => {
//   const {user, setUser} = useContext(UserContext);

//   if (!user || user === {} || !user.token || !user.profile) {
//     navigation.navigate('Start');
//   }

//   useEffect(() => {
//     trackScreen('YouAreListed', user.userid);

//     const checkVerified = async () => {
//       const u = await readIfUserVerified(user.token);
//       if (u && u.profile && u.profile.adminverified) {
//         navigation.dispatch(
//           CommonActions.reset({
//             index: 0,
//             routes: [{name: 'Events'}],
//           }),
//         );
//       }
//     };
//     checkVerified();
//   }, [navigation, user.token, user.userid]);

//   const resetStackToStart = () => {
//     navigation.dispatch(
//       CommonActions.reset({
//         index: 0,
//         routes: [{name: 'Start'}],
//       }),
//     );
//   };

//   const logOutBack = async () => {
//     return await logOut(setUser, user)
//       .then(async () => {
//         await identify(user.userid, user.email, user.profile);
//         resetStackToStart();
//       })
//       .catch((err) => {
//         console.log(err);
//         resetStackToStart();
//       });
//   };

//   const confirmLogout = () => {
//     Alert.alert('Do you really want to logout?', '', [
//       {text: 'Cancel'},
//       {
//         text: 'YES',
//         onPress: () => logOutBack(),
//       },
//     ]);
//   };

//   const onVerify = async () => {
//     const v = await readIfUserVerified(user.token);
//     if (v && v.profile && v.profile.adminverified) {
//       Alert.alert('Verified', 'Congrats! Your profile has been verified! :)', [
//         {
//           text: 'OK',
//           onPress: async () => {
//             navigation.dispatch(
//               CommonActions.reset({
//                 index: 0,
//                 routes: [{name: 'Events'}],
//               }),
//             );
//           },
//         },
//       ]);
//     } else if (
//       v.profile.adminrejected &&
//       v.profile.adminrejected.includes('true')
//     ) {
//       navigation.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [{name: 'IncompleteProfile'}],
//         }),
//       );
//     } else {
//       Alert.alert(
//         'Verified',
//         'Sorry! Your profile has not been verified yet! You will get notified via Push Notification and email as soon as the verification is completed.',
//       );
//     }
//   };

//   return (
//     <MainViewWrapper>
//       <AppHeader
//         navigation={navigation}
//         rightButton={{
//           iconName: 'log-out',
//           onPress: confirmLogout,
//         }}
//         leftButton={{
//           setting: true,
//         }}
//       />
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <ImageOutMainWrapper>
//           <ProfileImageBubble image={user.profile.photo} />
//         </ImageOutMainWrapper>
//         <InnerView>
//           <TitleText
//             title={true}
//             fontSize={'36px'}
//             text="You are on the waitinglist."
//           />
//           <DescriptionWrapper>
//             <ListText>
//               We are verifying all profiles manually to keep a good experience
//               within our community. We will let you know as soon as your profile
//               is verified.
//             </ListText>
//           </DescriptionWrapper>
//           <ButtonWrapper>
//             <Button
//               buttonText="Check to see if you’re verified"
//               onPress={() => onVerify()}
//             />
//           </ButtonWrapper>
//           <HowCirclesWorksScreen navigation={navigation} />
//         </InnerView>
//       </ScrollView>
//     </MainViewWrapper>
//   );
// };

// YouAreListedScreen.defaultProps = defaultProps;
// YouAreListedScreen.propTypes = propTypes;

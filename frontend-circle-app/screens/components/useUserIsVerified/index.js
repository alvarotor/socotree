import {useEffect, useState, useContext} from 'react';
import {readIfUserVerified} from '../../../core';
import {UserContext} from '../../UserContext';

export const useUserIsVerified = (token) => {
  const {user, setUser} = useContext(UserContext);
  const [profileVerified, setProfileVerified] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkVerified = async () => {
      const u = await readIfUserVerified(token);
      // if (!u || !u.profile || !u.profile.adminverified) {
      //   navigation.dispatch(
      //     CommonActions.reset({
      //       index: 0,
      //       routes: [{name: 'YouAreListed'}],
      //     }),
      //   );
      // } else
      if (!isMounted) {
        return;
      }
      // console.log(u);
      // console.log('1');
      if (
        u.profile?.adminrejectedname ||
        u.profile?.adminrejecteddob ||
        u.profile?.adminrejectedphoto ||
        u.profile?.adminrejectedinterests ||
        u.profile?.adminrejectedquestions ||
        u.profile?.adminrejecteddistrict
      ) {
        // console.log(user);
        setUser({
          ...user,
          profile: {
            ...user.profile,
            adminrejectedname: u.profile?.adminrejectedname,
            adminrejecteddob: u.profile?.adminrejecteddob,
            adminrejectedphoto: u.profile?.adminrejectedphoto,
            adminrejectedinterests: u.profile?.adminrejectedinterests,
            adminrejectedquestions: u.profile?.adminrejectedquestions,
            adminrejecteddistrict: u.profile?.adminrejecteddistrict,
          },
        });
        // console.log('2');
        // user.profile.adminverified = u.profile.adminverified;
        // user.profile.adminrejected = u.profile.adminrejected;
        setProfileVerified(false);
      }
    };

    checkVerified();

    return () => {
      isMounted = false;
    };
  }, [token, setUser, user]);

  // console.log('3');

  return profileVerified;
};

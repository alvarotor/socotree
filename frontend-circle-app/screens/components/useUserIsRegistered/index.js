import {useEffect, useState} from 'react';

export const useUserIsRegistered = (user) => {
  const [profileDone, setProfileDone] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (
      user.profile.name.length > 0 &&
      user.userinterest.length > 2 &&
      user.profile.photo.length > 0 &&
      user.profile.ageyear > 0 &&
      user.profile.agemonth > 0 &&
      user.profile.ageday > 0 &&
      user.profile.district > 0 &&
      user.profile.logged
    ) {
      if (!isMounted) {
        return;
      }
      setProfileDone(true);
    }

    return () => {
      isMounted = false;
    };
  }, [
    user.profile.ageday,
    user.profile.agemonth,
    user.profile.ageyear,
    user.profile.district,
    user.profile.logged,
    user.profile.photo,
    user.profile.name,
    user.userinterest,
  ]);

  return profileDone;
};

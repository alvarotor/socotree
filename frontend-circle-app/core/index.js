import fetchGraphQL from '../api/fetch';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';

export const sendForgottenPassword = async (email) => {
  const res = await fetchGraphQL(
    `mutation {
      forgotPassword(email: "${email}")
    }`,
    '',
    '',
    false,
  );
  if (res && res.data.forgotPassword) {
    return new Promise.resolve(true);
  } else {
    return new Promise.reject(res?.data?.errors);
  }
};

export const verifyPasswordForgottenCode = async (code, password) => {
  const res = await fetchGraphQL(
    `mutation {
      resetPassword(code: "${code}", password: "${password}")
    }`,
  );
  if (res && res.data.resetPassword) {
    return new Promise.resolve(true);
  } else {
    return new Promise.reject(res?.data?.errors);
  }
};

export const sendDeleteUser = async (token) => {
  const res = await fetchGraphQL(
    `mutation {
      deleteUser
    }`,
    '',
    token,
  );
  if (res && res.data.deleteUser) {
    return new Promise.resolve(true);
  } else {
    return new Promise.reject(res?.data?.errors);
  }
};

export const verifyMyEmail = async (token) => {
  const res = await fetchGraphQL(
    `mutation {
      resendVerifyUserEmail
    }`,
    '',
    token,
  );
  if (!res || !res.data || !res.data.resendVerifyUserEmail) {
    return new Promise.reject(res.data.resendVerifyUserEmail);
  } else {
    return new Promise.resolve(true);
  }
};

export const verifyMyEmailCode = async (token, code) => {
  const res = await fetchGraphQL(
    `mutation {
      verifyUserEmail(code:${code})
    }`,
    '',
    token,
    false,
  );
  if (!res || !res.data || !res.data.verifyUserEmail) {
    return new Promise.reject(res.data.verifyUserEmail);
  } else {
    return new Promise.resolve(true);
  }
};

export const changePassword = async (password, token) => {
  const res = await fetchGraphQL(
    `mutation {
      updatePassword(password: "${password}")
    }`,
    '',
    token,
  );
  if (!res || !res.data || !res.data.updatePassword) {
    return new Promise.reject(res?.data?.errors);
  } else {
    return new Promise.resolve(true);
  }
};

export const updateUserData = async (user) => {
  const {
    name,
    photo,
    ageyear,
    agemonth,
    ageday,
    phone,
    phoneprefix,
    newsupdate,
    profession,
    district,
    login,
    pushnotificationswitch,
    logged,
    emailsswitch,
  } = user.profile;

  const res = await fetchGraphQL(
    `mutation {
      updateUser(
        name:"${name}",
        photo:"${photo}",
        profession:"${profession}",
        district:${district},
        login:"${login}",
        phone:"${phone}",
        phoneprefix:"${phoneprefix}",
        newsupdate:${newsupdate},
        ageyear:${parseInt(ageyear, 10)},
        agemonth:${parseInt(agemonth, 10)},
        ageday:${parseInt(ageday, 10)},
        fcmtoken:"${await AsyncStorage.getItem('fcmToken')}",
        pushnotificationswitch:${pushnotificationswitch},
        emailsswitch:${emailsswitch},
        logged:${logged},
        build:${DeviceInfo.getBuildNumber()},
        platform:"${DeviceInfo.getSystemName()}",
      ) {
        name
        photo
        ageday
        agemonth
        ageyear
        phone
        phoneprefix
        profession
        district
        login
        newsupdate
        adminrejectedname
        adminrejecteddob
        adminrejectedphoto
        adminrejectedinterests
        adminrejectedquestions
        adminrejecteddistrict
        fcmtoken
        pushnotificationswitch
        logged
        emailsswitch
        build
        admin
      }
    }`,
    '',
    user.token,
  );

  if (res && res.data && res.data.updateUser) {
    await AsyncStorage.setItem('loginUser', JSON.stringify(user));
    return Promise.resolve(res.data.updateUser);
  } else {
    return Promise.reject(res?.data?.errors);
  }
};

export const logOut = async (setUser, user) => {
  const logoutUser = {
    ...user,
    profile: {...user.profile, logged: false},
  };
  setUser(logoutUser);
  await updateUserData(logoutUser).finally(async () => {
    const getAllKeys = await AsyncStorage.getAllKeys();
    getAllKeys.map(async (key) => {
      if (key.startsWith('circle-')) {
        await AsyncStorage.removeItem(key);
      }
    });
    await AsyncStorage.removeItem('loginUser');
    return Promise.resolve(true);
  });
  // await AsyncStorage.removeItem('fcmToken');
};

export const create = async (email, password) => {
  const res = await fetchGraphQL(
    `mutation {
      createUser(
        email: "${email}",
        password: "${password}"
      ) 
    }`,
  );
  if (res && res.data && res.data.createUser) {
    return Promise.resolve(res.data);
  } else {
    return Promise.reject(res?.data?.errors);
  }
};

export const logIn = async (email, password) => {
  const resSignIn = await fetchGraphQL(
    `{
      login(
        email: "${email}",
        password: "${password}"
      ) {
        token
      }
    }`,
    '',
    '',
    false,
  ).catch((err) => {
    return Promise.reject(err);
  });

  if (!resSignIn || !resSignIn.data || !resSignIn.data.login) {
    return Promise.reject(resSignIn?.data?.errors);
  }

  const res = await fetchGraphQL(
    `{
      user {
        userid
        email
        created
        updated
        emailverified
        profile {
          ageday
          agemonth
          ageyear
          name
          photo
          phone
          profession
          district
          login
          admin
          phoneprefix
          newsupdate
          adminrejectedname
          adminrejectedphoto
          adminrejecteddob
          adminrejectedquestions
          adminrejectedinterests
          adminrejecteddistrict
          fcmtoken
          pushnotificationswitch
          emailsswitch
          build
        }
        userinterest {
          interestid
          interest {
            name
          }
        }
        blockedusers {
          userblockedid
        }
      }
    }`,
    '',
    resSignIn.data.login.token,
  ).catch((err) => {
    return Promise.reject(err);
  });

  res.data.user.token = resSignIn.data.login.token;
  return Promise.resolve(res.data.user);
};

export const existUser = async (email) => {
  try {
    const res = await fetchGraphQL(
      `{
        existUser(email: "${email}")
      }`,
      '',
      '',
      false,
    );
    return res && res.data.existUser;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const checkMyCircles = async (token) => {
  const res = await fetchGraphQL(
    `{
      circlesByUser {
        circleid
        eventid
        userid
        user {
          profile {
            name
            photo
          }
          blockedusers {
            userblockedid
          }
        }
      }
    }`,
    '',
    token,
  );
  if (res && res.data && res.data.circlesByUser) {
    return Promise.resolve(res.data.circlesByUser);
  } else {
    return Promise.reject(res?.errors[0].message);
  }
};

export const checkCircle = async (token, circle) => {
  const res = await fetchGraphQL(
    `{
      circle(circleid: "${circle}") {
        circleid
        eventid
        userid
        event {
          name
        }
        user {
          email
          profile {
            name
            ageday
            ageyear
            agemonth
            photo
          }
          userinterest {
            interestid
            interest {
              name
            }
          }
          blockedusers {
            userblockedid
          }
        }
      }
    }`,
    '',
    token,
  );

  if (res && res.data && res.data.circle) {
    return Promise.resolve(res.data.circle);
  } else {
    return Promise.reject(res?.errors[0].message);
  }
};

export const messagesCircle = async (token, circle) => {
  const res = await fetchGraphQL(
    `{
      messages(circleid:"${circle}"){
        userid
        created
        message
        user {
          email
        }
      }
    }`,
    '',
    token,
  );
  if (res && res.data && res.data.messages) {
    return Promise.resolve(res.data.messages);
  } else {
    return Promise.reject(res?.errors[0].message);
  }
};

export const createUserAnswers = async (token, answers) => {
  const res = await fetchGraphQL(
    `mutation {
      createUserAnswers(
        answers: "${answers}"
      )
    }`,
    '',
    token,
  );
  if (res && res.data && res.data.createUserAnswers) {
    return Promise.resolve(res.data.createUserAnswers);
  } else {
    return Promise.reject(res?.errors[0].message);
  }
};

export const createUserInterests = async (token, interests) => {
  const res = await fetchGraphQL(
    `mutation {
      createUserInterests(
        interests: "${interests}"
      )
    }`,
    '',
    token,
  );
  if (res && res.data && res.data.createUserInterests) {
    return Promise.resolve(res.data.createUserInterests);
  } else {
    return Promise.reject(res?.errors[0].message);
  }
};

export const blockProfile = async (profile, token) => {
  const res = await fetchGraphQL(
    `mutation {
      blockProfile(
        profile: "${profile}"
      )
    }`,
    '',
    token,
  );
  if (res && res.data && res.data.blockProfile) {
    return Promise.resolve(res.data.blockProfile);
  } else {
    return Promise.reject(res?.errors[0].message);
  }
};

export const unblockProfile = async (profile, token) => {
  const res = await fetchGraphQL(
    `mutation {
      unblockProfile(
        profile: "${profile}"
      )
    }`,
    '',
    token,
  );
  if (res && res.data && res.data.unblockProfile) {
    return Promise.resolve(res.data.unblockProfile);
  } else {
    return Promise.reject(res?.errors[0].message);
  }
};

// export const deleteUserAnswer = async (token, question) => {
//   const res = await fetchGraphQL(
//     `mutation {
//       deleteUserAnswer(question: "${question}")
//     }`,
//     '',
//     token,
//   ).catch((e) => {
//     return Promise.reject(e);
//   });

//   if (res.errors?.length > 0) {
//     return Promise.reject(res.errors[0].message);
//   }

//   return Promise.resolve(res.data.deleteUserAnswer);
// };

export const questions = async () => {
  const res = await fetchGraphQL(
    `{
      questions {
        question
        uuid
        global
        answers {
          answer
          uuid
        }
      }
    }`,
    '',
  );
  if (res && res.data && res.data.questions) {
    return Promise.resolve(res.data.questions.filter((q) => q.global));
  } else {
    return Promise.reject(res?.errors[0].message);
  }
};

export const readUserAnswers = async (token) => {
  const res = await fetchGraphQL(
    `{
      readUserAnswers {
        answerid
        questionid
      }
    }`,
    '',
    token,
  );
  if (res && res.data && res.data.readUserAnswers) {
    return Promise.resolve(res.data.readUserAnswers);
  } else {
    return Promise.reject(res?.errors[0].message);
  }
};

export const interests = async () => {
  const res = await fetchGraphQL(
    `{
      interests {
        name
        uuid
        adminverified
      }
    }`,
    '',
  );
  if (res && res.data && res.data.interests) {
    return Promise.resolve(res.data.interests);
  } else {
    return Promise.reject(res?.errors[0].message);
  }
};

export const deleteUserInterests = async (token) => {
  const res = await fetchGraphQL(
    `mutation {
      deleteUserInterests
    }`,
    '',
    token,
  );
  if (res && res.data && res.data.deleteUserInterests) {
    return Promise.resolve(res.data.deleteUserInterests);
  } else {
    return Promise.reject(res?.errors[0].message);
  }
};

export const setMyAnswers = async (q, token) => {
  let myQuestions = [...q];
  const myAnswers = await readUserAnswers(token);
  // console.log('myQuestions', myQuestions);
  // console.log('myAnswers', myAnswers);
  for (const question in myQuestions) {
    for (const myAnswer in myAnswers) {
      // console.log('myQuestions[question]', myQuestions[question]);
      if (myAnswers[myAnswer].questionid === myQuestions[question].uuid) {
        for (const answer in myQuestions[question].answers) {
          if (
            myQuestions[question].answers[answer].uuid ===
            myAnswers[myAnswer].answerid
          ) {
            myQuestions[question].selectedAnswer = myAnswers[myAnswer].answerid;
            break;
          }
        }
        break;
      }
    }
  }
  // console.log('myQuestions r', myQuestions);
  return myQuestions;
};

export const setMyAnswersEvent = async (q, token) => {
  let myQuestions = [...q];
  const myAnswers = await readUserAnswers(token);
  // console.log('myQuestions', myQuestions);
  // console.log('myAnswers', myAnswers);
  for (const question in myQuestions) {
    for (const myAnswer in myAnswers) {
      if (myAnswers[myAnswer].questionid === myQuestions[question].questionid) {
        // console.log(
        //   'myQuestions[question].question.answers',
        //   myQuestions[question].question.answers,
        // );
        for (const answer in myQuestions[question].question.answers) {
          if (
            myQuestions[question].question.answers[answer].uuid ===
            myAnswers[myAnswer].answerid
          ) {
            myQuestions[question].selectedAnswer = myAnswers[myAnswer].answerid;
            break;
          }
        }
        break;
      }
    }
  }
  return myQuestions;
};

export const readIfUserVerified = async (token) => {
  const res = await fetchGraphQL(
    `{
      user {
        profile {
          adminrejectedname
          adminrejectedphoto
          adminrejecteddob
          adminrejectedquestions
          adminrejectedinterests
          adminrejecteddistrict
        }
      }
    }`,
    '',
    token,
  );
  if (res && res.data && res.data.user) {
    return Promise.resolve(res.data.user);
  } else {
    return Promise.reject(res?.errors[0].message);
  }
};

export const isUserBlocked = ({blockedusers}, userid) => {
  for (let u = 0; u < blockedusers.length; u++) {
    const element = blockedusers[u];
    if (element.userblockedid === userid) {
      return true;
    }
  }
  return false;
};

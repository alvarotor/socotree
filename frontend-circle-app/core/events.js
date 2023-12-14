import fetchGraphQL from '../api/fetch';
import {Platform} from 'react-native';

export const getEvents = async () => {
  const res = await fetchGraphQL(
    `{
      events(filterOlds: true) {
        smalldescription
        description
        name
        uuid
        picture
        eventtime {
          day
          hour
          minute
          month
          year
        }
      }
    }`,
  ).catch((e) => {
    return Promise.reject(e);
  });

  if (res.errors?.length > 0) {
    return Promise.reject(res.errors[0].message);
  }

  return Promise.resolve(res.data.events);
};

export const getEvent = async (id) => {
  const res = await fetchGraphQL(
    `{
      event(id: "${id}") {
        uuid
        name
        smalldescription
        description
        link
        picture
        type
        eventtime {
          day
          month
          year
          hour
          minute
        }
        eventquestion {
          questionid
          question {
            question
            answers {
              answer
              uuid
            }
          }
        }
      }
    }`,
  ).catch((e) => {
    return Promise.reject(e);
  });

  if (res.errors?.length > 0) {
    return Promise.reject(res.errors[0].message);
  }

  return Promise.resolve(res.data.event);
};

export const userExistsEventJoin = async (eventid, token) => {
  const res = await fetchGraphQL(
    `{
      userExistsEventJoined(eventid: "${eventid}")
    }`,
    '',
    token,
  ).catch((e) => {
    return Promise.reject(e);
  });

  if (res.errors?.length > 0) {
    return Promise.reject(res.errors[0].message);
  }

  return Promise.resolve(res.data.userExistsEventJoined);
};

export const setUserEventJoin = async (eventid, token) => {
  const res = await fetchGraphQL(
    `mutation {
      setUserEventJoin(eventid: "${eventid}")
    }`,
    '',
    token,
  ).catch((e) => {
    return Promise.reject(e);
  });

  if (res.errors?.length > 0) {
    return Promise.reject(res.errors[0].message);
  }

  return Promise.resolve(res.data.setUserEventJoin);
};

export const userExistsEventRemind = async (eventid, token) => {
  const res = await fetchGraphQL(
    `{
      userExistsEventRegistered(eventid: "${eventid}")
    }`,
    '',
    token,
  ).catch((e) => {
    return Promise.reject(e);
  });

  if (res.errors?.length > 0) {
    return Promise.reject(res.errors[0].message);
  }

  return Promise.resolve(res.data.userExistsEventRegistered);
};

export const setUserEventRemind = async (eventid, token) => {
  const res = await fetchGraphQL(
    `mutation {
      setUserEventRegister(eventid: "${eventid}")
    }`,
    '',
    token,
  ).catch((e) => {
    return Promise.reject(e);
  });

  if (res.errors?.length > 0) {
    return Promise.reject(res.errors[0].message);
  }

  return Promise.resolve(res.data.setUserEventRegister);
};

export const userEventsRemind = async (token) => {
  const res = await fetchGraphQL(
    `{
      getUserRegisteredEvents {
        eventid
        userid
      }
    }`,
    '',
    token,
  ).catch((e) => {
    return Promise.reject(e);
  });

  if (res.errors?.length > 0) {
    return Promise.reject(res.errors[0].message);
  }

  return Promise.resolve(res.data.getUserRegisteredEvents);
};

const kTC = (figures) => ('0' + figures).slice(-2);

export const timeUTC = (eventtime) => {
  const {year, month, day, hour, minute} = eventtime;
  const time =
    Platform.OS === 'android'
      ? `${year}-${kTC(month)}-${kTC(day)} ` + `${kTC(hour)}:${kTC(minute)}`
      : `${kTC(month)}/${kTC(day)}/${year} ` +
        `${kTC(hour)}:${kTC(minute)} UTC`;
  return new Date(time).toISOString();
};

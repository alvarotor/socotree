import fetchGraphQL from '../../../Api/fetchGraphQL';

export const circleMe = (id, circle, setCircle) => {
  const pos = circle.indexOf(id);
  if (pos === -1) {
    circle.push(id);
  } else {
    circle.splice(pos, 1);
  }
  setCircle(circle);
};

export const makeCircle = async (
  circle,
  setSending,
  token,
  setCircle,
  eventid,
) => {
  setSending(true);
  if (eventid.length === 0) {
    alert('Select an event first');
    setSending(false);
    return;
  }
  if (circle.length === 0) {
    alert('Select some users first');
    setSending(false);
    return;
  }
  if (circle.length > 0 && circle.length < 2) {
    alert('Select more that one user');
    setSending(false);
    return;
  }

  const res = await fetchGraphQL(
    `mutation {
        createCircle(circleid:"new", eventid:"${eventid}", users:"${circle.join(
      ',',
    )}")
      }`,
    '',
    token,
  );

  if (res && res.data && res.data.createCircle) {
    setSending(false);
    setCircle([]);
    alert('Circle Created');
  } else {
    alert(res.data.errors[0].message);
  }
};

export const circles = (history) => {
  history.push('/circles/all');
};

export const matchCircles = async (
  history,
  setSending,
  addrestusers,
  questionsweight,
  recircle,
  age,
  prematch,
  lang,
  circlesize,
  event,
) => {
  setSending(true);
  if (event.length === 0) {
    alert('Select an event first');
    setSending(false);
    return;
  }
  const urlHost =
    process.env.REACT_APP_API_URL === 'localhost'
      ? 'localhost:5000'
      : process.env.REACT_APP_API_URL;

  console.log(questionsweight);
  console.log(
    `${process.env.REACT_APP_API_HOST}://${urlHost}/${
      process.env.REACT_APP_API_URL === 'localhost' ? '' : 'matching_algo/'
    }ematch?dashboard=si&eventid=${event}${
      addrestusers ? '&addrestusers=si' : ''
    }${recircle ? '&recircle=si' : ''}${age ? '&age=si' : ''}${
      prematch ? '&prematch=si' : ''
    }${lang ? '&lang=si' : ''}${
      parseInt(circlesize, 10) > 0 ? '&circlesize=' + circlesize : ''
    }${
      parseFloat(questionsweight) > 0
        ? '&questionsweight=' + questionsweight
        : ''
    }`,
  );

  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}://${urlHost}/${
      process.env.REACT_APP_API_URL === 'localhost' ? '' : 'matching_algo/'
    }ematch?dashboard=si&eventid=${event}${
      addrestusers ? '&addrestusers=si' : ''
    }${recircle ? '&recircle=si' : ''}${age ? '&age=si' : ''}${
      prematch ? '&prematch=si' : ''
    }${lang ? '&lang=si' : ''}${
      parseInt(circlesize, 10) > 0 ? '&circlesize=' + circlesize : ''
    }${
      parseFloat(questionsweight) > 0
        ? '&questionsweight=' + questionsweight
        : ''
    }`,
    {
      method: 'POST',
    },
  );

  const json = await response.json();
  console.log(json);
  if (json?.success === true) {
    alert(`circles: ${json.circles}, total users: ${json.total_users}`);
    setSending(false);
    if (json.circles > 0 && json.total_users > 0) {
      circles(history);
    }
  } else {
    alert(
      'Theres been an error creating matching circles. ' +
        json?.message +
        json?.error,
    );
    setSending(false);
  }
};

export const notifyCircles = async (token, setSending, eventid) => {
  setSending(true);
  if (eventid.length === 0) {
    alert('Select an event first');
    setSending(false);
    return;
  }
  const res = await fetchGraphQL(
    `mutation {
        notifyCircles(eventid: "${eventid}")
      }`,
    '',
    token,
  );

  if (res && res.data && res.data.notifyCircles) {
    setSending(false);
    alert('New circles notified');
  } else {
    alert(res.data.errors[0].message);
  }
};

export const joinUsers = async (
  circle,
  setSending,
  token,
  setCircle,
  eventid,
) => {
  // console.log(eventid);
  // console.log(circle);
  setSending(true);
  if (eventid.length === 0) {
    alert('Select an event first');
    setSending(false);
    return;
  }
  if (circle.length === 0) {
    alert('Select some users first');
    setSending(false);
    return;
  }
  if (circle.length > 0 && circle.length < 2) {
    alert('Select more that one user');
    setSending(false);
    return;
  }

  const res = await fetchGraphQL(
    `mutation {
        setUserEventJoinByAdmin(eventid:"${eventid}", 
        users:"${circle.join(',')}")
      }`,
    '',
    token,
  );

  if (res && res.data && res.data.setUserEventJoinByAdmin) {
    setSending(false);
    setCircle([]);
    alert('Users joined');
  } else {
    alert(res.data.errors[0].message);
  }
};

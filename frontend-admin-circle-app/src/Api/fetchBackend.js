async function fetchBackend(user) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_HOST}://${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_PORT_MESSAGES}/v1/${user}`,
      {
        method: 'POST',
      },
    );

    const res = await response.json();
    return Promise.resolve(res);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export default fetchBackend;

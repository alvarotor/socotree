async function fetchGraphQL(text, variables, token) {
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}://${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_PORT}/v1/graphql/`,
    {
      method: 'POST',
      headers: {
        Authentication: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: text,
        variables,
      }),
    },
  ).catch((err) => {
    console.error(err);
    alert(err.message || err);
  });

  const res = await response.json();

  if (res.errors && res.errors.length > 0) {
    console.error(res.errors);
    alert(res.errors[0].message);
    throw Error(res.errors[0].message);
  }

  return res;
}

export default fetchGraphQL;

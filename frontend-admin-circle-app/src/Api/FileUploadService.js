export const upload = async (eventid, file, token) => {
  const url = `${process.env.REACT_APP_API_HOST}://${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_PORT}/v1/uploadevent/`;
  const headers = {
    Authentication: token,
  };

  let formData = new FormData();
  formData.append('file', file);
  formData.append('eventid', eventid);

  const r = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  return await r.json();
};

import fetchGraphQL from '../api/fetch';

export const mailReportUser = async (id, token) => {
  const res = await fetchGraphQL(
    `mutation {
        reportprofile(reportedid:"${id}")
      }`,
    '',
    token,
  );
  if (!res || !res.data || !res.data.reportprofile) {
    return new Promise.reject(false);
  } else {
    return new Promise.resolve(true);
  }
};

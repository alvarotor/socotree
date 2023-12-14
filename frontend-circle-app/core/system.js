import fetchGraphQL from '../api/fetch';

export const updateVersion = async () => {
  const res = await fetchGraphQL(
    `{
      updatedVersion {
        androidbuild
        iosbuild
        androidbuildforced
        iosbuildforced
      }
    }`,
  );
  if (!res || !res.data || !res.data.updatedVersion) {
    return new Promise.reject(null);
  } else {
    return new Promise.resolve(res.data.updatedVersion);
  }
};

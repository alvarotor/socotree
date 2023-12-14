import React, {Suspense} from 'react';
import Spinner from '../../Spinner';
const UpdateDetails = React.lazy(() => import('./Details'));

export default () => {
  return (
    <Suspense fallback={<Spinner />}>
      <h1>Versions Update</h1>
      <UpdateDetails />
    </Suspense>
  );
};

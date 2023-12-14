import React, {Suspense} from 'react';
import Spinner from '../Spinner';
const Details = React.lazy(() => import('./Details'));

export default () => (
  <Suspense fallback={<Spinner />}>
    <h1>Versions</h1>
    <Details />
  </Suspense>
);

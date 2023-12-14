import React, {Suspense} from 'react';
import Spinner from '../Spinner';
const Details = React.lazy(() => import('./Details'));

export default ({match}) => {
  const {id} = match.params;
  return (
    <Suspense fallback={<Spinner />}>
      <h1>Circle Messages</h1>
      <Details id={id} />
    </Suspense>
  );
};

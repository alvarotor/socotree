import React, { Suspense } from "react";
import Spinner from "../../Spinner";
const InterestUpdateDetails = React.lazy(() => import("./Details"));

export default ({ match }) => {
  const { id } = match.params;
  return (
    <Suspense fallback={<Spinner />}>
      <InterestUpdateDetails id={id} />
    </Suspense>
  );
};

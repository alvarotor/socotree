import React, { Suspense } from "react";
import Spinner from "../../Spinner";
const InterestDetails = React.lazy(() => import("./Details"));

export default ({ match }) => {
  const { id } = match.params;
  return (
    <Suspense fallback={<Spinner />}>
      <InterestDetails id={id} />
    </Suspense>
  );
};

import React, { Suspense } from "react";
import Spinner from "../Spinner";
const EventDetails = React.lazy(() => import("./Details"));

export default ({ match }) => {
  const { id } = match.params;
  return (
    <Suspense fallback={<Spinner />}>
      <EventDetails id={id} />
    </Suspense>
  );
};

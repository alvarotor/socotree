import React, { Suspense } from "react";
import Spinner from "../Spinner";
const EventsDetails = React.lazy(() => import("./Details"));

export default () => (
  <Suspense fallback={<Spinner />}>
    <EventsDetails />
  </Suspense>
);

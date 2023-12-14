import React, { Suspense } from "react";
import Spinner from "../Spinner";
const CirclesAllDetails = React.lazy(() => import("./Details"));

export default () => (
  <Suspense fallback={<Spinner />}>
    <h1>Circles All</h1>
    <CirclesAllDetails />
  </Suspense>
);
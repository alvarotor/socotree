import React, { Suspense } from "react";
import Spinner from "../Spinner";
const CirclesDetails = React.lazy(() => import("./Details"));

export default () => (
  <Suspense fallback={<Spinner />}>
    <h1>Circles Users</h1>
    <CirclesDetails />
  </Suspense>
);
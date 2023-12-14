import React, { Suspense } from "react";
import Spinner from "../Spinner";
const InterestsDetails = React.lazy(() => import("./Details"));

export default () => (
  <Suspense fallback={<Spinner />}>
    <h1>Interests</h1>
    <InterestsDetails />
  </Suspense>
);
import React, { Suspense } from "react";
import Spinner from "../Spinner";
const UsersDetails = React.lazy(() => import("./Details"));

export default () => (
  <Suspense fallback={<Spinner />}>
    <h1>All Users</h1>
    <UsersDetails />
  </Suspense>
);

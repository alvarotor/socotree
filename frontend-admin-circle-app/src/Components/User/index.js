import React, { Suspense } from "react";
import Spinner from "../Spinner";
const UserDetails = React.lazy(() => import("./Details"));

export default ({ match }) => {
  const { id } = match.params;
  return (
    <Suspense fallback={<Spinner />}>
      <UserDetails id={id} />
    </Suspense>
  );
};

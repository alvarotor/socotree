import React, { Suspense } from "react";
import Spinner from "../../Spinner";
const QuestionUpdateDetails = React.lazy(() => import("./Details"));

export default ({ match }) => {
  const { id } = match.params;
  return (
    <Suspense fallback={<Spinner />}>
      <QuestionUpdateDetails id={id} />
    </Suspense>
  );
};

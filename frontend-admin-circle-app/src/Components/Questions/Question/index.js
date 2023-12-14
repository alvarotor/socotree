import React, { Suspense } from "react";
import Spinner from "../../Spinner";
const QuestionDetails = React.lazy(() => import("./Details"));

export default ({ match }) => {
  const { id } = match.params;
  return (
    <Suspense fallback={<Spinner />}>
      <QuestionDetails id={id} />
    </Suspense>
  );
};

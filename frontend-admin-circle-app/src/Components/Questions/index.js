import React, { Suspense } from "react";
import Spinner from "../Spinner";
const QuestionsDetails = React.lazy(() => import("./Details"));

export default () => (
  <Suspense fallback={<Spinner />}>
    <h1>Questions</h1>
    <QuestionsDetails />
  </Suspense>
);
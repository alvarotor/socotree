import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <Link to="/">Home</Link>
      <p>This is 404 Not Found</p>
    </>
  );
}

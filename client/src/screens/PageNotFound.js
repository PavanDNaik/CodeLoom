import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="page-not-found">
      <div>
        Page Not Found Sorry, but we can't find the page you are looking for. If
        you have Not Yet Logged in{" "}
        <div className="link-to-other-method">
          <Link to="/login">Click here</Link>
        </div>
      </div>
    </div>
  );
}

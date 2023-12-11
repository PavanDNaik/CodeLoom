import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const FETCH_BASE_URI = process.env.REACT_APP_FETCH_BASE_URL;
function AdminLogIn() {
  const [showPage, setShowPage] = useState(false);
  const [password, setPasswrod] = useState("");
  const { admin } = useParams();
  const { email } = useParams();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function handleAdminSubmit() {
    const adminDetails = await fetch(
      FETCH_BASE_URI + `/admin/${admin}/${email}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: JSON.parse(localStorage.getItem("authToken")),
        },
        body: JSON.stringify({
          password,
        }),
      }
    );
    const adminDetailsJSON = await adminDetails.json();
    console.log(adminDetailsJSON.adminAuthToken);
    if (adminDetailsJSON.fetchError || !adminDetailsJSON.adminAuthToken) {
      setError("adminDetails.fetchError");
    } else {
      localStorage.setItem("adminAuthToken", adminDetailsJSON.adminAuthToken);
      navigate(`/admin/${admin}/dashboard/`);
    }
  }
  useEffect(() => {
    fetch(FETCH_BASE_URI + `/admin/${admin}/${email}/admin-exists`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: JSON.parse(localStorage.getItem("authToken")),
      },
    }).then(async (data) => {
      const adminExist = await data.json();
      if (adminExist.exists) {
        setShowPage(true);
      } else {
        setError("Page not Found");
      }
    });
  }, [admin, email]);
  return showPage ? (
    <div className="log-in-container">
      <div className="log-in">
        <div className="log-in-title">Admin-Log-In</div>
        <div className={`error-message ${error === "" ? "hide-message" : ""}`}>
          {error + " !!"}
        </div>
        <input
          className="sign-in-input"
          type="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => {
            setPasswrod(e.target.value);
          }}
        />
        <button onClick={handleAdminSubmit} className="log-in-button">
          SUBMIT
        </button>
      </div>
    </div>
  ) : (
    <div className="Auth-message-container">
      <div className="Auth-message">{error || "Fetching Page Details!!"}</div>
    </div>
  );
}

export default AdminLogIn;

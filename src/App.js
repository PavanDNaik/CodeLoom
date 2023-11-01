import Home from "./screens/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./screens/Login";
import Signupform from "./components/Signupform";
import Loginform from "./components/Loginform";
// import { useState } from "react";
function App() {
  // const [user, setUser] = useState(undefined);
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/sign-up" element={<Signupform />} />
          <Route exact path="/login" element={<Loginform />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
